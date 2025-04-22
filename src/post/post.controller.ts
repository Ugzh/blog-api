import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from '../comment/_utils/dtos/create-comment.dto';
import { UserByIdPipe } from '../user/_utils/user-by-id.pipe';
import { UserDocument } from '../user/schema/user.schema';
import { PostByIdPipe } from './_utils/post-by-id.pipe';
import { PostDocument } from './schemas/post.schema';
import { CommentByIdPipe } from './_utils/comment-by-id.pipe';
import { CommentDocument } from '../comment/schemas/comment.schema';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  getPostsPagination(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.postService.getAllPosts(page, limit);
  }

  @Get('/author')
  @ApiOperation({ summary: 'Get all posts by author' })
  getPostByAuthor(@Query('author') author: string) {
    return this.postService.getAllPostByUser(author);
  }

  @Post()
  @FormDataRequest()
  @ApiParam({ type: CreatePostDto, name: 'createPostDto' })
  @ApiOperation({ summary: 'Create post' })
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Post('/:postId/comment')
  @ApiOperation({ summary: 'Create comment' })
  createComment(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.createComment(post, createCommentDto);
  }

  @Get('/:postId')
  @ApiOperation({ summary: 'Get post by ID' })
  getPostById(@Param('postId', PostByIdPipe) post: PostDocument) {
    return this.postService.getPostById(post);
  }

  @Delete('/:postId/:userId')
  @ApiOperation({ summary: 'Delete post' })
  deletePostById(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Param('userId', UserByIdPipe) user: UserDocument,
  ) {
    return this.postService.deletePostById(post, user);
  }

  @Post('/:postId/:userId')
  @ApiOperation({ summary: 'Update post by ID' })
  updatePostById(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Param('userId', UserByIdPipe) user: UserDocument,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePostById(post, user, updatePostDto);
  }

  @Post('/like-post/:postId/:userId')
  @ApiOperation({ summary: 'Like post by Id' })
  updatedLikeOnPost(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Param('userId', UserByIdPipe) user: UserDocument,
  ) {
    return this.postService.updateLikeOnPost(post, user);
  }

  @Post('/like-comment/:postId/:commentId/:userId')
  @ApiOperation({ summary: 'Like post by Id' })
  updatedLikeOnComment(
    @Param('postId', PostByIdPipe) post: PostDocument,
    @Param('commentId', CommentByIdPipe) comment: CommentDocument,
    @Param('userId', UserByIdPipe) user: UserDocument,
  ) {
    return this.postService.updateLikeOnComment(post, comment, user);
  }
}
