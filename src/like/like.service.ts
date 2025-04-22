import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './schemas/like.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class LikeService {
  private readonly LIKE_NOT_FOUND_EXCEPTION = new NotFoundException(
    "Like doesn't exists",
  );
  private readonly POST_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Post not found',
  );
  private readonly COMMENT_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Comment not found',
  );
  private readonly USER_NOT_FOUND_EXCEPTION = new NotFoundException(
    'User not found',
  );

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

  getAllLikesByPost(likeDocument: LikeDocument) {
    return this.likeModel
      .find({ postId: likeDocument.postId })
      .countDocuments()
      .orFail(this.POST_NOT_FOUND_EXCEPTION)
      .exec();
  }

  getAllLikesByComment(likeDocument: LikeDocument) {
    return this.likeModel
      .find({ commentId: likeDocument.commentId })
      .countDocuments()
      .orFail(this.COMMENT_NOT_FOUND_EXCEPTION)
      .exec();
  }

  getAllLikesByUser(likeDocument: LikeDocument) {
    return this.likeModel
      .find({ userId: likeDocument.userId })
      .countDocuments()
      .orFail(this.USER_NOT_FOUND_EXCEPTION)
      .exec();
  }
}
