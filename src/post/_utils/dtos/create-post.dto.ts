import { IsArray, IsEnum, IsString } from 'class-validator';
import { CategoryEnum } from '../enums/category.enum';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  text: string;
  @IsString()
  author: string;

  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  category: CategoryEnum[];
}
