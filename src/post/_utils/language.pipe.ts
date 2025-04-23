import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LangKey, langs } from './const-langs';

@Injectable()
export class LanguagePipe implements PipeTransform<string, LangKey> {
  transform(language: string): LangKey {
    if (!language) {
      return 'fr' as LangKey;
    }
    if (!(language in langs))
      throw new BadRequestException(
        "not a correct language, must be a code like 'fr' for french",
      );
    return language as LangKey;
  }
}
