import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EncryptionModule } from './encryption/encryption.module';
import { CommentModule } from './comment/comment.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { MinioModule } from './minio/minio.module';
import { LikeModule } from './like/like.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_CONFIG_USERNAME}:${process.env.MONGO_CONFIG_PASSWORD}@mongo:27017/${process.env.MONGO_DB}?authSource=admin`,
    ),
    PostModule,
    AuthModule,
    UserModule,
    EncryptionModule,
    CommentModule,
    NodemailerModule,
    MinioModule,
    LikeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
