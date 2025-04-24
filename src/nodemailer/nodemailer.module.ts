import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILHOG_NAME,
          port: 1025,
          ignoreTLS: true,
        },
        template: {
          dir: path.join(process.cwd(), 'src/nodemailer/templates'),
          adapter: new EjsAdapter(),
        },
        defaults: {
          from: '"Support Technique" <support@ugo.com>',
        },
      }),
    }),
  ],
  providers: [NodemailerService],
})
export class NodemailerModule {}
