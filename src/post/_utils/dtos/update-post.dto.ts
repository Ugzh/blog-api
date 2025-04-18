import { IsArray, IsEnum, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { CategoryEnum } from '../enums/category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty()
  @Optional()
  @IsString()
  title: string;

  @ApiProperty()
  @Optional()
  @IsString()
  text: string;

  @ApiProperty()
  @Optional()
  @IsArray()
  @IsEnum(CategoryEnum, { each: true })
  category: CategoryEnum[];
}
