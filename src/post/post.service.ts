import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { PostMapper } from './post.mapper';
import { isValidObjectId } from 'mongoose';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postMapper: PostMapper,
  ) {}

  getAllPosts = () => {
    return this.postRepository.getAllPosts();
  };

  getAllPostByUser = async (author: string) => {
    if (!author)
      throw new HttpException("Author's missing", HttpStatus.BAD_REQUEST);
    const posts = await this.postRepository.getAllPostByUser(author);
    return posts.map((post) => this.postMapper.fromDbToPost(post));
  };

  createPost = async (createPostDto: CreatePostDto) => {
    if (
      (createPostDto.author.length &&
        createPostDto.text.length &&
        createPostDto.category.length &&
        createPostDto.title.length) < 1
    ) {
      throw new HttpException(
        'At least 1 field is empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    const post = await this.postRepository.createPost(createPostDto);
    return this.postMapper.fromDbToPost(post);
  };

  getPostById = async (id: string) => {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        'Wrong id article format',
        HttpStatus.BAD_REQUEST,
      );
    }
    const post = await this.postRepository.getPostById(id);
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
    id: string,
    author: string,
    updatePostDto: UpdatePostDto,
  ) => {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        'Wrong id article format',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!updatePostDto || Object.keys(updatePostDto).length === 0) {
      throw new HttpException(
        'Fill at least one field',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postRepository.updatePostById(id, updatePostDto);
  };

  createComment = (idPost: string, createCommentDto: CreateCommentDto) => {
    if (!isValidObjectId(idPost)) {
      throw new HttpException(
        'Wrong id article format',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      (createCommentDto.comment.length || createCommentDto.author.length) < 1
    ) {
      throw new HttpException(
        'At least 1 field is empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postRepository.createComment(idPost, createCommentDto);
  };

  updateComment = (
    idPost: string,
    idComment: string,
    updateCommentDto: UpdateCommentDto,
  ) => {
    if (!isValidObjectId(idPost) || !isValidObjectId(idPost)) {
      throw new HttpException(
        'Wrong id article or comment format',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateCommentDto.comment.length < 1) {
      throw new HttpException(
        'At least 1 field is empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postRepository.updateComment(
      idPost,
      idComment,
      updateCommentDto,
    );
  };
}
