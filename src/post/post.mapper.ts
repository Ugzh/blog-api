import { Injectable } from '@nestjs/common';
import { Post } from './schemas/post.schema';
import { GetPostDto } from './_utils/dtos/responses/get-post.dto';
import { WithId } from 'mongodb';

@Injectable()
export class PostMapper {
  fromDbToPost = (postDocument: WithId<Post>): GetPostDto => ({
    id: postDocument._id.toString(),
    title: postDocument.title,
    text: postDocument.text,
    author: postDocument.author,
    category: postDocument.category,
    comments: postDocument.comments,
    time_to_read: postDocument.time_to_read,
  });
}
