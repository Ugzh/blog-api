import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AbstractEncrypter } from './encryptors/abstract.encrypter';
import { NoopEncrypter } from './encryptors/noop.encrypter';
import { BcryptEncrypter } from './encryptors/bcrypt.encrypter';

interface PasswordStatus {
  isPasswordCorrect: boolean;
  isEncryptionChanged: boolean;
}

@Injectable()
export class EncryptionService {
  private currentEncrypter: AbstractEncrypter;

  private readonly encryptorsArr = [NoopEncrypter, BcryptEncrypter];

  private readonly encryptors: Map<string, AbstractEncrypter>;

  constructor() {
    const initEncryptors = this.encryptorsArr.map(
      (encrypter) => new encrypter(),
    );
    const encryptorSet = new Set(
      initEncryptors.map((encrypter) => encrypter.name),
    );

    if (encryptorSet.size < initEncryptors.length)
      throw new InternalServerErrorException(
        'Encrypter error: Encryptors must have different names',
      );

    this.encryptors = new Map(
      initEncryptors.map((encrypter) => [encrypter.name, encrypter]),
    );
    this.currentEncrypter = [...this.encryptors.values()].reduce(
      (acc, level) => (level.securityLevel > acc.securityLevel ? level : acc),
    );
  }

  encrypt(password: string): string {
    const encrypter = this.currentEncrypter.name;
    const hash = this.currentEncrypter.encrypt(password);
    return `{${encrypter}}${hash}`;
  }

  compare(password: string, hashPassword: string): PasswordStatus {
    const separator = hashPassword.indexOf('}');

    if (hashPassword.at(0) !== '{' || separator === -1)
      throw new InternalServerErrorException(
        'Encrypter error: Hash syntax error',
      );

    const encryption = hashPassword.substring(1, separator);
    hashPassword = hashPassword.substring(separator + 1);

    const encrypter = this.encryptors.get(encryption);

    if (!encrypter)
      throw new InternalServerErrorException(
        'Encrypter error: Bad encrypter name',
      );
    return {
      isEncryptionChanged: encryption !== this.currentEncrypter.name,
      isPasswordCorrect: encrypter.compare(password, hashPassword),
    };
  }
}
