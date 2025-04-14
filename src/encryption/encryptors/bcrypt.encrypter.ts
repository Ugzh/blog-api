import * as bcrypt from 'bcrypt';
import { AbstractEncrypter } from './abstract.encrypter';

export class BcryptEncrypter extends AbstractEncrypter {
  readonly name = 'bcrypt';
  readonly securityLevel = 50;

  compare(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }

  encrypt(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
