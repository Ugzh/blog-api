import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';
import { UserRepository } from '../user/user.repository';

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
    private userRepository: UserRepository,
  ) {}

  getAllPosts = () => {
    return this.postModel.find().exec();
  };

  getAllPostByUser = (author: string) => {
    return this.postModel
      .find()
      .where({ author: author })
      .orFail(this.USER_NOT_FOUND_EXCEPTION)
      .exec();
  };

  getPostById = (id: string) => {
    return this.postModel
      .findById(id)
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
      category: createPostDto.category,
      userId: user._id,
      timeToRead: createPostDto.text.length / 0.6,
    });
  };

  deletePostById = (id: string) => {
    return this.postModel
      .deleteOne({ _id: id })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  updatePostById = async (
    id: string,
    author: string,
    updatePostDto: UpdatePostDto,
  ) => {
    return this.postModel
      .updateOne({ _id: id }, { $set: { ...updatePostDto } })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  createComment = (idPost: string, createCommentDto: CreateCommentDto) => {
    return this.postModel
      .updateOne({ _id: idPost }, { $push: { comments: createCommentDto } })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  updateComment = (
    idPost: string,
    idComment: string,
    updateCommentDto: UpdateCommentDto,
  ) => {
    return this.postModel
      .updateOne(
        { _id: idPost, 'comments._id': idComment },
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
