import { Types } from 'mongoose';

export class GetPostDto {
  id: string;
  title: string;
  text: string;
  author: string;
  user: Types.ObjectId;
  category: string[];
  comments: Types.ObjectId[];
  timeToRead: number;
}
