import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';
import { UserRepository } from '../user/user.repository';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class PostRepository {
  private readonly USER_NOT_FOUND_EXCEPTION = new HttpException(
    'User not found',
    HttpStatus.NOT_FOUND,
  );
  private readonly POST_NOT_FOUND_EXCEPTION = new HttpException(
    'Post not found',
    HttpStatus.NOT_FOUND,
  );
  private readonly COMMENT_NOT_FOUND_EXCEPTION = new HttpException(
    'Comment not found',
    HttpStatus.NOT_FOUND,
  );

  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
    private userRepository: UserRepository,
  ) {}

  getAllPosts = () => {
    return this.postModel
      .find()
      .populate('comments')
      .populate('userId', 'username')
      .exec();
  };

  getAllPostByUser = (author: string) => {
    return this.postModel
      .find({ author })
      .populate('comments')
      .populate('userId', 'username')
      .orFail(this.USER_NOT_FOUND_EXCEPTION)
      .exec();
  };

  getPostById = async (idPost: string) => {
    return this.postModel
      .findOne({ _id: idPost })
      .populate('comments', 'comment')
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  createPost = async (createPostDto: CreatePostDto) => {
    const user = await this.userRepository.findUserByUsername(
      createPostDto.author,
    );
    return this.postModel.create({
      title: createPostDto.title,
      text: createPostDto.text,
      author: createPostDto.author,
      userId: user._id,
      category: createPostDto.category,
      comments: [],
      timeToRead: Math.ceil(createPostDto.text.length / 600),
    });
  };

  deletePostById = (id: string) => {
    return this.postModel
      .deleteOne({ _id: id })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  updatePostById = async (post: PostDocument, updatePostDto: UpdatePostDto) => {
    return this.postModel
      .updateOne({ _id: post._id }, { $set: { ...updatePostDto } })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  createComment = async (
    post: PostDocument,
    createCommentDto: CreateCommentDto,
  ) => {
    const user = await this.userRepository.findUserByUsername(
      createCommentDto.author,
    );

    const comment = await this.commentModel.create({
      author: createCommentDto.author,
      comment: createCommentDto.comment,
      userId: user._id,
    });

    return this.postModel
      .updateOne({ _id: post._id }, { $push: { comments: comment._id } })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  updateComment = (
    post: PostDocument,
    comment: CommentDocument,
    updateCommentDto: UpdateCommentDto,
  ) => {
    return this.postModel
      .updateOne(
        { _id: post._id, 'comments._id': comment._id },
        {
          $set: {
            'comments.$.comment': updateCommentDto.comment,
          },
        },
      )
      .orFail(this.COMMENT_NOT_FOUND_EXCEPTION)
      .exec();
  };
}
