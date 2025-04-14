export abstract class AbstractEncrypter {
  abstract readonly name: string;
  abstract readonly securityLevel: number;

  abstract encrypt(password: string): string;

  abstract compare(password: string, hashPassword: string): boolean;
}
