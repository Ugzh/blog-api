import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get()
  getPostByAuthor(@Query('author') author: string) {
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

  @Post('/:postId')
  updatePostById(
    @Param('postId') id: string,
    @Param('author') author: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePostById(id, author, updatePostDto);
  }

  @Post('/:postId/comment')
  createComment(
    @Param('postId') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.createComment(id, createCommentDto);
  }

  @Patch('/:postId/comment/:idComment')
  updateComment(
    @Param('postId') idPost: string,
    @Param('idComment') idComment: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.postService.updateComment(idPost, idComment, updateCommentDto);
  }
}
