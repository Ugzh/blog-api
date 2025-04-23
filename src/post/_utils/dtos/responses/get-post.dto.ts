import { UserDocument } from '../../../../user/schema/user.schema';
import { CommentWithLikeInterface } from '../../../../comment/_utils/interfaces/comment-with-like.interface';

export class GetPostDto {
  id: string;
  title: string;
  text: string;
  author: string;
  user?: UserDocument;
  nbLikes?: number;
  category: string[];
  comments: CommentWithLikeInterface[];
  image_url: string | null;
  timeToRead: number;
}
