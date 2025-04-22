import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class CreateLikeDto {
  @ApiProperty()
  @IsMongoId()
  userId: Types.ObjectId;

  @ApiProperty()
  @Optional()
  @IsMongoId()
  postId: Types.ObjectId;

  @ApiProperty()
  @Optional()
  @IsMongoId()
  commentId: Types.ObjectId;
}
