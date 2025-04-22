import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsString()
  comment: string;
}
