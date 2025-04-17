import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostMapper } from './post.mapper';
import { UserModule } from '../user/user.module';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentModule } from '../comment/comment.module';
import { CommentRepository } from '../comment/comment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    UserModule,
    CommentModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostMapper, CommentRepository],
})
export class PostModule {}
