import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EncryptionModule } from './encryption/encryption.module';
import { CommentModule } from './comment/comment.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/blog'),
    PostModule,
    AuthModule,
    UserModule,
    EncryptionModule,
    CommentModule,
    NodemailerModule,
    MinioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
