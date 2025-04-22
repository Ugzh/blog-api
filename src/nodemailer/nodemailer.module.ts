import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'localhost',
          port: 1025,
          ignoreTLS: true,
        },
        template: { dir: __dirname + '/templates', adapter: new EjsAdapter() },
        defaults: {
          from: '"Support Technique" <support@ugo.com>',
        },
      }),
    }),
  ],
  providers: [NodemailerService],
})
export class NodemailerModule {}
