import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommentSchema } from './comment.schema';
import { HydratedDocument } from 'mongoose';

export type postDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  category: string[];

  @Prop({ type: CommentSchema, default: null })
  comment: Comment[] | null;

  @Prop({ required: true })
  time_to_read: number;

  @Prop({ type: Date, required: true, default: Date.now() })
  created_at: Date;

  @Prop({ type: Date, required: false, default: null })
  updated_at: Date | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);
