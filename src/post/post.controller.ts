import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';
import { UserByIdPipe } from '../user/_utils/user-by-id.pipe';
import { UserDocument } from '../user/schema/user.schema';
import { PostByIdPipe } from './_utils/post-by-id.pipe';
import { PostDocument } from './schemas/post.schema';
import { CommentByIdPipe } from './_utils/comment-by-id.pipe';
import { CommentDocument } from '../comment/schemas/comment.schema';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/author')
  getPostByAuthor(@Query('author') author: string) {
    return this.postService.getAllPostByUser(author);
  }

  @Get()
  getPostsPagination(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.postService.getAllPosts(page, limit);
  }

  @Get('/all')
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post()
  @FormDataRequest()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Post('/:postId/comment')
  createComment(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.createComment(post, createCommentDto);
  }

  @Get('/:postId')
  getPostById(@Param('postId', PostByIdPipe) post: PostDocument) {
    return this.postService.getPostById(post);
  }

  @Delete('/:postId/:userId')
  deletePostById(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Param('userId', UserByIdPipe) user: UserDocument,
  ) {
    return this.postService.deletePostById(post, user);
  }

  @Post('/:postId/:userId')
  updatePostById(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Param('userId', UserByIdPipe) user: UserDocument,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePostById(post, user, updatePostDto);
  }

  @Patch('/:postId/comment/:idComment/:userId')
  updateComment(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Param('idComment', CommentByIdPipe) comment: CommentDocument,
    @Param('userId', UserByIdPipe) user: UserDocument,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.postService.updateComment(
      post,
      comment,
      user,
      updateCommentDto,
    );
  }
}
