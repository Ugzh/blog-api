import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './schemas/like.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name)
    private likeModel: Model<Like>,
  ) {}

  async updateLikeOnPost(postId: Types.ObjectId, userId: Types.ObjectId) {
    const postLikeByUser = await this.likeModel
      .find({ $and: [{ postId }, { userId }] })
      .exec();
    if (postLikeByUser.length !== 0) {
      return this.likeModel.deleteOne({ _id: postLikeByUser[0]._id }).exec();
    } else {
      return this.likeModel.create({
        userId,
        postId,
      });
    }
  }

  async updateLikeOnComment(commentId: Types.ObjectId, userId: Types.ObjectId) {
    const commentLikeByUser = await this.likeModel
      .find({ $and: [{ commentId }, { userId }] })
      .exec();
    if (commentLikeByUser.length !== 0) {
      return this.likeModel.deleteOne({ _id: commentLikeByUser[0]._id }).exec();
    } else {
      return this.likeModel.create({
        userId,
        commentId,
      });
    }
  }
}
