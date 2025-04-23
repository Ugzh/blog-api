import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UserRepository } from '../user/user.repository';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';

@Injectable()
export class CommentRepository {
  private readonly COMMENT_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Comment not found',
  );
  private readonly COMMENT_NOT_DELETE = new NotFoundException(
    'Comment not delete',
  );

  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    private readonly userRepository: UserRepository,
  ) {}

  createComment = async (createCommentDto: CreateCommentDto) => {
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

  deleteManyComments = async (comments: Types.ObjectId[]) => {
    return this.commentModel
      .deleteMany({ _id: { $in: comments } })
      .orFail(this.COMMENT_NOT_DELETE)
      .exec();
  };
}
