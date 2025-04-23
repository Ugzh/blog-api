import { Types } from 'mongoose';
import { UserDocument } from '../../../user/schema/user.schema';

export interface CommentWithLikeInterface {
  _id: Types.ObjectId;
  comment: string;
  userId: UserDocument;
  nbLikes: number;
}
