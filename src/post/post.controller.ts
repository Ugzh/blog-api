import { Controller, Get, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPost(@Query('author') author: string) {
    return this.postService.getAllPostByUser(author);
  }
}
