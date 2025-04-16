import { Types } from 'mongoose';

export class GetPostDto {
  id: string;
  title: string;
  text: string;
  author: string;
  userId: Types.ObjectId;
  category: string[];
  comments: Types.ObjectId[];
  timeToRead: number;
}
