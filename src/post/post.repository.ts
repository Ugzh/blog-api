import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

  async getAllPostByUser(author: string): Promise<Post[]> {
    return await this.postModel.find().where('author').equals(author).exec();
  }
}
