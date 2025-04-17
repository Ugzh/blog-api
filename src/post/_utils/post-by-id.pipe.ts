import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PostDocument } from '../schemas/post.schema';
import { isValidObjectId } from 'mongoose';
import { PostRepository } from '../post.repository';

@Injectable()
export class PostByIdPipe
  implements PipeTransform<string, Promise<PostDocument>>
{
  constructor(private postRepository: PostRepository) {}

  transform(postId: string): Promise<PostDocument> {
    if (!isValidObjectId(postId))
      throw new BadRequestException('Wrong post id');
    return this.postRepository.getPostById(postId);
  }
}
