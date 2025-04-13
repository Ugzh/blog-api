import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  author: string;
  @IsString()
  comment: string;
}
