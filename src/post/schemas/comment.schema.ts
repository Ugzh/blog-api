import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ type: Date, required: true, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, required: false, default: null })
  updated_at: Date | null;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
