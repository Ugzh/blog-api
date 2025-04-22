import { PostDocument } from '../../schemas/post.schema';
import { UserDocument } from '../../../user/schema/user.schema';

export interface PostWithLikeInterface extends PostDocument {
  nbLikes?: number;
  user?: UserDocument;
}
