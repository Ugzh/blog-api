import { AbstractEncrypter } from './abstract.encrypter';

export class NoopEncrypter extends AbstractEncrypter {
  readonly name = 'noop';
  readonly securityLevel = 0;

  compare(password: string, hashPassword: string): boolean {
    return password === hashPassword;
  }

  encrypt(password: string): string {
    return password;
  }
}
