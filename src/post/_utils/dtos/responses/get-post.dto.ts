import { Comment } from '../../../schemas/comment.schema';

export class GetPostDto {
  id: string;
  title: string;
  text: string;
  author: string;
  category: string[];
  comments: Comment[];
  time_to_read: number;
}
