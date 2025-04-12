import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './_utils/dtos/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPostByUser(author: string) {
    return this.postRepository.getAllPostByUser(author);
  }

  async createPost(createPostDto: CreatePostDto) {
    await this.postRepository.createPost(createPostDto);
    return;
  }
}
