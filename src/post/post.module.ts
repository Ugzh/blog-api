import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostMapper } from './post.mapper';
import { UserModule } from '../user/user.module';
import { Comment, CommentSchema } from '../comment/schemas/comment.schema';
import { CommentModule } from '../comment/comment.module';
import { CommentRepository } from '../comment/comment.repository';
import { MinioService } from '../minio/minio.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { LikeService } from '../like/like.service';
import { Like, LikeSchema } from '../like/schemas/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    UserModule,
    CommentModule,
    NestjsFormDataModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostMapper,
    CommentRepository,
    MinioService,
    LikeService,
  ],
})
export class PostModule {}
