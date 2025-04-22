import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CategoryEnum } from '../_utils/enums/category.enum';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  author: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ enum: CategoryEnum, type: [String], required: true })
  category: CategoryEnum[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
  comments: Types.ObjectId[];

  @Prop({ type: String, default: null })
  image_url: string | null;

  @Prop({ required: true })
  timeToRead: number;

  createdAt: Date;

  updatedAt: Date;
}
export const PostSchema = SchemaFactory.createForClass(Post);
