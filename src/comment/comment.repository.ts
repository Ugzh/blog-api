import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../post/schemas/comment.schema';
import { Model } from 'mongoose';
import { PostDocument } from '../post/schemas/post.schema';
import { CreateCommentDto } from '../post/_utils/dtos/create-comment.dto';
import { UserRepository } from '../user/user.repository';
import { UpdateCommentDto } from '../post/_utils/dtos/update-comment.dto';

@Injectable()
export class CommentRepository {
  private readonly COMMENT_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Comment not found',
  );

  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    private readonly userRepository: UserRepository,
  ) {}

  createComment = async (
    post: PostDocument,
    createCommentDto: CreateCommentDto,
  ) => {
    const user = await this.userRepository.findUserByUsername(
      createCommentDto.author,
    );

    return this.commentModel.create({
      author: createCommentDto.author,
      comment: createCommentDto.comment,
      userId: user._id,
    });
  };

  updateComment = async (
    comment: CommentDocument,
    updateCommentDto: UpdateCommentDto,
  ) => {
    return this.commentModel
      .findOneAndUpdate(
        { _id: comment._id },
        { $set: { comment: updateCommentDto.comment } },
        { new: true },
      )
      .orFail(this.COMMENT_NOT_FOUND_EXCEPTION)
      .exec();
  };
}
