import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRoleEnum } from '../_utils/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ enum: UserRoleEnum, default: UserRoleEnum.READER })
  role: UserRoleEnum;

  @Prop({ type: String, required: false, default: null })
  profile_image_url: string | null;

  @Prop({ type: Date, required: true, default: Date.now })
  created_at: Date;

  @Prop({ type: Date, required: false, default: null })
  updated_at: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
