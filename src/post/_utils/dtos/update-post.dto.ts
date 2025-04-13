import { IsArray, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  title: string;
  @IsString()
  text: string;
  @IsArray()
  category: string[];
}
