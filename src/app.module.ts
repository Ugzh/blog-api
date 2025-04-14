import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/blog'),
    PostModule,
    AuthModule,
    UserModule,
    EncryptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
