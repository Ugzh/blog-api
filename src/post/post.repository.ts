import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Aggregate, Model, Types } from 'mongoose';
import { CreatePostDto } from './_utils/dtos/create-post.dto';
import { UpdatePostDto } from './_utils/dtos/update-post.dto';
import { CreateCommentDto } from '../comment/_utils/dtos/create-comment.dto';
import { UserRepository } from '../user/user.repository';
import { CommentDocument } from '../comment/schemas/comment.schema';
import { CommentRepository } from '../comment/comment.repository';
import { MinioService } from '../minio/minio.service';
import { LikeService } from '../like/like.service';
import { UserDocument } from '../user/schema/user.schema';
import { PostWithLikeInterface } from './_utils/interfaces/post-with-like.interface';

@Injectable()
export class PostRepository {
  private readonly POST_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Post not found',
  );

  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    private readonly minioService: MinioService,
    private readonly likeService: LikeService,
  ) {}

  getAllPostsWithLikes = async (page: number = 1, limit: number = 50) => {
    const numOfPosts = await this.postModel.find().exec();
    const posts = await this.postModel.aggregate([
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { _id: 1, username: 1 } },
          ],
          as: 'user',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'comments',
          pipeline: [{ $project: { _id: 1, comment: 1, userId: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id', commentIds: '$comments._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$$postId', '$postId'] },
                    { $in: ['$commentId', '$$commentIds'] },
                  ],
                },
              },
            },
          ],
          as: 'allLikes',
        },
      },
      {
        $addFields: {
          nbLikes: {
            $size: {
              $filter: {
                input: '$allLikes',
                cond: { $eq: ['$$this.postId', '$_id'] },
              },
            },
          },
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                $mergeObjects: [
                  '$$comment',
                  {
                    nbLikes: {
                      $size: {
                        $filter: {
                          input: '$allLikes',
                          cond: { $eq: ['$$this.commentId', '$$comment._id'] },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          allLikes: 0,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    return {
      posts,
      metadata: { page, limit, totalElement: numOfPosts.length },
    };
  };

  getAllPostsByAuthorWithLikes = async (
    author: string,
  ): Promise<Aggregate<Array<PostWithLikeInterface>>> => {
    return this.postModel.aggregate([
      {
        $match: { author },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { _id: 1, username: 1 } },
          ],
          as: 'user',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'comments',
          pipeline: [{ $project: { _id: 1, comment: 1, userId: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id', commentIds: '$comments._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$$postId', '$postId'] },
                    { $in: ['$commentId', '$$commentIds'] },
                  ],
                },
              },
            },
          ],
          as: 'allLikes',
        },
      },
      {
        $addFields: {
          nbLikes: {
            $size: {
              $filter: {
                input: '$allLikes',
                cond: { $eq: ['$$this.postId', '$_id'] },
              },
            },
          },
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                $mergeObjects: [
                  '$$comment',
                  {
                    nbLikes: {
                      $size: {
                        $filter: {
                          input: '$allLikes',
                          cond: { $eq: ['$$this.commentId', '$$comment._id'] },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          allLikes: 0,
        },
      },
    ]);
  };

  getPostById = async (idPost: string) => {
    return this.postModel
      .findOne({ _id: idPost })
      .populate('comments', 'comment')
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  };

  getPostByIdWithLikes = async (idPost: Types.ObjectId) => {
    const [post]: PostWithLikeInterface[] = await this.postModel.aggregate([
      { $match: { _id: idPost } },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
            { $project: { _id: 1, username: 1 } },
          ],
          as: 'user',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'comments',
          pipeline: [{ $project: { _id: 1, comment: 1, userId: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id', commentIds: '$comments._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$$postId', '$postId'] },
                    { $in: ['$commentId', { $ifNull: ['$$commentIds', []] }] },
                  ],
                },
              },
            },
          ],
          as: 'allLikes',
        },
      },
      {
        $addFields: {
          nbLikes: {
            $size: {
              $filter: {
                input: '$allLikes',
                cond: { $eq: ['$$this.postId', '$_id'] },
              },
            },
          },
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                $mergeObjects: [
                  '$$comment',
                  {
                    nbLikes: {
                      $size: {
                        $filter: {
                          input: '$allLikes',
                          cond: { $eq: ['$$this.commentId', '$$comment._id'] },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          allLikes: 0,
          'user.password': 0,
          'user.email': 0,
          userId: 0,
        },
      },
    ]);
    return post;
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
      image_url: createPostDto.image
        ? await this.minioService.getUrlImage(createPostDto.image)
        : null,
      timeToRead: Math.ceil(createPostDto.text.length / 60),
    });
  };

  deletePostById = async (post: PostDocument) => {
    const postDelete = await this.postModel
      .deleteOne({ _id: post._id })
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
    if (postDelete.deletedCount > 0 && post.comments.length > 1) {
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
    const comment =
      await this.commentRepository.createComment(createCommentDto);
    return this.postModel
      .findOneAndUpdate(
        { _id: post._id },
        { $push: { comments: comment._id } },
        { new: true },
      )
      .populate('comments')
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  }

  async updateLikeOnPost(post: PostDocument, user: UserDocument) {
    await this.likeService.updateLikeOnPost(post._id, user._id);
    return this.getPostByIdWithLikes(post._id);
  }

  async updateLikeOnComment(comment: CommentDocument, user: UserDocument) {
    return this.likeService.updateLikeOnComment(comment._id, user._id);
  }
}
