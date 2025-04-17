import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../post/schemas/comment.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
  ) {}
}
