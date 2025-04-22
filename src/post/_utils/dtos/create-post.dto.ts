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
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty({ enum: CategoryEnum, type: 'array' })
  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return [value.toUpperCase()];
    }
    return value;
  })
  category: CategoryEnum[];

  @ApiProperty()
  @Optional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
  image: MemoryStoredFile;
}
