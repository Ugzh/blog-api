import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './_utils/dtos/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPost(@Query('author') author: string) {
    return this.postService.getAllPostByUser(author);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get('/:postId')
  getPostById(@Param('postId') id: string) {
    return this.postService.getPostById(id);
  }

  @Delete('/:postId')
  deletePostById(@Param('postId') id: string) {
    return this.postService.deletePostById(id);
  }
}
