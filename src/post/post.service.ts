import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { PostMapper } from './post.mapper';
import { isValidObjectId } from 'mongoose';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';
import { UserDocument } from '../user/schema/user.schema';
import { PostDocument } from './schemas/post.schema';
import { CommentDocument } from './schemas/comment.schema';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postMapper: PostMapper,
  ) {}

  getAllPosts = async () => {
    const posts = await this.postRepository.getAllPosts();
    return posts.map((post) => this.postMapper.fromDbToPost(post));
  };

  getAllPostByUser = async (author: string) => {
    if (!author)
      throw new HttpException("Author's missing", HttpStatus.BAD_REQUEST);
    const posts = await this.postRepository.getAllPostByUser(author);
    return posts.map((post) => this.postMapper.fromDbToPost(post));
  };

  createPost = async (createPostDto: CreatePostDto) => {
    if (Object.keys(createPostDto).length === 0) {
      throw new HttpException(
        'At least 1 field is empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    const post = await this.postRepository.createPost(createPostDto);
    return this.postMapper.fromDbToPost(post);
  };

  getPostById = (post: PostDocument) => {
    return this.postMapper.fromDbToPost(post);
  };

  deletePostById = (id: string) => {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        'Wrong id article format',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postRepository.deletePostById(id);
  };

  updatePostById = (
    post: PostDocument,
    user: UserDocument,
    updatePostDto: UpdatePostDto,
  ) => {
    if (!updatePostDto || Object.keys(updatePostDto).length === 0) {
      throw new HttpException(
        'Fill at least one field',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user._id.toString() !== post.userId.toString())
      throw new UnauthorizedException('You can only update your article');
    return this.postRepository.updatePostById(post, updatePostDto);
  };

  createComment = (post: PostDocument, createCommentDto: CreateCommentDto) => {
    if (
      (createCommentDto.comment.length || createCommentDto.author.length) < 1
    ) {
      throw new HttpException(
        'At least 1 field is empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postRepository.createComment(post, createCommentDto);
  };

  updateComment = (
    post: PostDocument,
    comment: CommentDocument,
    user: UserDocument,
    updateCommentDto: UpdateCommentDto,
  ) => {
    if (user._id.toString() !== comment.userId.toString())
      throw new UnauthorizedException('You can only update your comment');
    if (updateCommentDto.comment.length < 1) {
      throw new HttpException(
        'At least 1 field is empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postRepository.updateComment(post, comment, updateCommentDto);
  };
}
