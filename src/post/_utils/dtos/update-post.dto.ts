import { IsArray, IsEnum, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { CategoryEnum } from '../enums/category.enum';

export class UpdatePostDto {
  @Optional()
  @IsString()
  title: string;

  @Optional()
  @IsString()
  text: string;

  @Optional()
  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  category: CategoryEnum[];
}
