import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { PostMapper } from './post.mapper';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from '../comment/_utils/dtos/create-comment.dto';
import { UserDocument } from '../user/schema/user.schema';
import { PostDocument } from './schemas/post.schema';
import { CommentDocument } from '../comment/schemas/comment.schema';
import { MinioService } from '../minio/minio.service';
import { translatePost } from './_utils/translate-post';
import { LangKey } from 'google-translate-api-browser/dest/types/LangKey';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postMapper: PostMapper,
    private readonly minioService: MinioService,
  ) {}

  getAllPosts = async (page?: number, limit?: number) => {
    const { posts, metadata } = await this.postRepository.getAllPostsWithLikes(
      page,
      limit,
    );
    return {
      metadata,
      posts: posts.map((post) => this.postMapper.fromDbToPost(post)),
    };
  };

  getAllPostByUser = async (author: string) => {
    if (!author)
      throw new HttpException("Author's missing", HttpStatus.BAD_REQUEST);
    const posts =
      await this.postRepository.getAllPostsByAuthorWithLikes(author);
    return posts.map((post) => this.postMapper.fromDbToPost(post));
  };

  createPost = async (createPostDto: CreatePostDto) => {
    if (createPostDto.image) {
      await this.minioService.sendImage(createPostDto.image);
    }
    return this.postRepository.createPost(createPostDto);
  };

  getPostById = async (post: PostDocument, language?: LangKey) => {
    const postWithLikes = await this.postRepository.getPostByIdWithLikes(
      post._id,
    );
    return language !== 'fr'
      ? await translatePost(postWithLikes, language)
      : postWithLikes;
  };

  deletePostById = (post: PostDocument, user: UserDocument) => {
    if (user._id.toString() !== post.userId.toString())
      throw new UnauthorizedException('You can only delete your post');
    return this.postRepository.deletePostById(post);
  };

  updatePostById = (
    post: PostDocument,
    user: UserDocument,
    updatePostDto: UpdatePostDto,
  ) => {
    if (user._id.toString() !== post.userId.toString())
      throw new UnauthorizedException('You can only update your post');
    return this.postRepository.updatePostById(post, updatePostDto);
  };

  createComment = (post: PostDocument, createCommentDto: CreateCommentDto) => {
    return this.postRepository.updatePostWithNewComment(post, createCommentDto);
  };

  updateLikeOnPost = async (post: PostDocument, user: UserDocument) => {
    const postUpdated = await this.postRepository.updateLikeOnPost(post, user);
    return this.postMapper.fromDbToPost(postUpdated);
  };

  updateLikeOnComment = async (
    post: PostDocument,
    comment: CommentDocument,
    user: UserDocument,
  ) => {
    await this.postRepository.updateLikeOnComment(comment, user);
    return this.postRepository.getPostByIdWithLikes(post._id);
  };
}
