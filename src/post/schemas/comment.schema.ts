import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  comment: string;

  createdAt: Date;

  updatedAt: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
