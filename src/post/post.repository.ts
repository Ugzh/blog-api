import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from './_utils/dtos/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/update-comment.dto';
import { UserRepository } from '../user/user.repository';
import { CommentDocument } from '../comment/schemas/comment.schema';
import { CommentRepository } from '../comment/comment.repository';

@Injectable()
export class PostRepository {
  private readonly USER_NOT_FOUND_EXCEPTION = new HttpException(
    'User not found',
    HttpStatus.NOT_FOUND,
  );
  private readonly POST_NOT_FOUND_EXCEPTION = new HttpException(
    'Post not found',
    HttpStatus.NOT_FOUND,
  );

  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
    private userRepository: UserRepository,
    private commentRepository: CommentRepository,
  ) {}

  getAllPosts = () => {
    return this.postModel
      .find()
      .populate('comments', 'comment')
      .populate('userId', 'username')
      .exec();
  };

  getAllPostByUser = (author: string) => {
    return this.postModel
      .find({ author })
      .populate('comments', 'comment')
      .populate('userId', 'username')
      .orFail(this.USER_NOT_FOUND_EXCEPTION)
      .exec();
  };

  getPostById = async (idPost: string) => {
    return this.postModel
      .findOne({ _id: idPost })
      .populate('comments', 'comment')
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  createPost = async (createPostDto: CreatePostDto) => {
    const user = await this.userRepository.findUserByUsername(
      createPostDto.author,
    );
    return this.postModel.create({
      title: createPostDto.title,
      text: createPostDto.text,
      author: createPostDto.author,
      userId: user._id,
      category: createPostDto.category,
      comments: [],
      timeToRead: Math.ceil(createPostDto.text.length / 600),
    });
  };

  deletePostById = async (post: PostDocument) => {
    const postDelete = await this.postModel
      .deleteOne({ _id: post._id })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
    if (postDelete.deletedCount > 0) {
      await this.commentRepository.deleteManyComments(post.comments);
    }
    return postDelete.deletedCount;
  };

  updatePostById = async (post: PostDocument, updatePostDto: UpdatePostDto) => {
    return this.postModel
      .updateOne({ _id: post._id }, { $set: { ...updatePostDto } })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  async updatePostWithNewComment(
    post: PostDocument,
    createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentRepository.createComment(
      post,
      createCommentDto,
    );
    return this.postModel
      .findOneAndUpdate(
        { _id: post._id },
        { $push: { comments: comment._id } },
        { new: true },
      )
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  }

  async updatePostWithUpdatedComment(
    post: PostDocument,
    comment: CommentDocument,
    updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentRepository.updateComment(comment, updateCommentDto);
    return this.getPostById(post._id.toString());
  }
}
