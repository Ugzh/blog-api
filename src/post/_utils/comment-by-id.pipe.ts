import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Comment, CommentDocument } from '../../comment/schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentByIdPipe
  implements PipeTransform<string, Promise<CommentDocument>>
{
  private readonly COMMENT_NOT_FOUND_EXCEPTION = new NotFoundException(
    'Comment not found',
  );

  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  transform(commentId: string): Promise<CommentDocument> {
    if (!isValidObjectId(commentId))
      throw new BadRequestException('Wrong comment id');
    return this.commentModel
      .findById(commentId)
      .orFail(this.COMMENT_NOT_FOUND_EXCEPTION)
      .exec();
  }
}
