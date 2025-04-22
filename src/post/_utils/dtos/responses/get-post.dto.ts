import { Types } from 'mongoose';
import { UserDocument } from '../../../../user/schema/user.schema';

export class GetPostDto {
  id: string;
  title: string;
  text: string;
  author: string;
  user?: UserDocument;
  nbLikes?: number;
  category: string[];
  comments: Types.ObjectId[];
  image_url: string | null;
  timeToRead: number;
}
