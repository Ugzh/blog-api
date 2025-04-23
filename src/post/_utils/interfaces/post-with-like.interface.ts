import { PostDocument } from '../../schemas/post.schema';
import { UserDocument } from '../../../user/schema/user.schema';
import { CommentWithLikeInterface } from '../../../comment/_utils/interfaces/comment-with-like.interface';

export interface PostWithLikeInterface extends Omit<PostDocument, 'comments'> {
  nbLikes?: number;
  user?: UserDocument;
  comments: CommentWithLikeInterface[];
  text: string;
  title: string;
}
