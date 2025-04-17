import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}

  sendForgotPasswordEmail = async (email: string, name: string) => {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      template: 'forgot-password.template.ejs',
      context: {
        name: name,
        forgotPasswordUrl: `Ceci est normalement un lien pour reset son password`,
      },
    });
  };
}
