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
import { UserByIdPipe } from '../user/_utils/user-by-id.pipe';
import { UserDocument } from '../user/schema/user.schema';
import { PostByIdPipe } from './_utils/post-by-id.pipe';
import { PostDocument } from './schemas/post.schema';
import { CommentByIdPipe } from './_utils/comment-by-id.pipe';
import { CommentDocument } from './schemas/comment.schema';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/author')
  getPostByAuthor(@Query('author') author: string) {
    return this.postService.getAllPostByUser(author);
  }

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post()
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

  @Delete('/:postId')
  deletePostById(@Param('postId', PostByIdPipe) id: string) {
    return this.postService.deletePostById(id);
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
