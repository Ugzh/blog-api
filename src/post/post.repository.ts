import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './_utils/dtos/create-post.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

  getAllPostByUser(author: string): Promise<Post[]> {
    console.log(author);
    return this.postModel.find().where({ author: author }).exec();
  }

  async createPost(createPostDto: CreatePostDto) {
    return await this.postModel.create({
      title: createPostDto.title,
      text: createPostDto.text,
      author: createPostDto.author,
      category: createPostDto.category,
      time_to_read: createPostDto.text.length / 0.6,
    });
  }
}
