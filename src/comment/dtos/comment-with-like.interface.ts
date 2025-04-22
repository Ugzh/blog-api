import { CommentDocument } from '../schemas/comment.schema';

export interface CommentWithLikeInterface extends CommentDocument {
  nbLikes: number;
}
