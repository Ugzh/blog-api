import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  category: string[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ required: true })
  timeToRead: number;

  createdAt: Date;

  updatedAt: Date;
}
export const PostSchema = SchemaFactory.createForClass(Post);
