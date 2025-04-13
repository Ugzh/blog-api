import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './_utils/dtos/create-post.dto';

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
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

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

  createPost = (createPostDto: CreatePostDto) => {
    return this.postModel.create({
      title: createPostDto.title,
      text: createPostDto.text,
      author: createPostDto.author,
      category: createPostDto.category,
      time_to_read: createPostDto.text.length / 0.6,
    });
  };

  deletePostById = (id: string) => {
    return this.postModel
      .deleteOne({ _id: id })
      .orFail(this.POST_NOT_FOUND_EXCEPTION);
  };
}
