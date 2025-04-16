import { IsArray, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class UpdatePostDto {
  @Optional()
  @IsString()
  title: string;

  @Optional()
  @IsString()
  text: string;

  @Optional()
  @IsArray()
  category: string[];
}
