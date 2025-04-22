import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'class-validator-extended';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateLikeDto {
  @ApiProperty()
  @Optional()
  @IsMongoId()
  postId: Types.ObjectId;

  @ApiProperty()
  @Optional()
  @IsMongoId()
  commentId: Types.ObjectId;
}
