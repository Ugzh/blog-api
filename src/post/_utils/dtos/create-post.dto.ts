import { IsArray, IsEnum, IsString } from 'class-validator';
import { CategoryEnum } from '../enums/category.enum';
import { Transform } from 'class-transformer';
import { Optional } from 'class-validator-extended';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  text: string;
  @IsString()
  author: string;

  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return [value.toUpperCase()];
    }
    return value;
  })
  category: CategoryEnum[];

  @Optional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  image: MemoryStoredFile;
}
