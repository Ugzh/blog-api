import { Injectable } from '@nestjs/common';
import { PostDocument } from './schemas/post.schema';
import { GetPostDto } from './_utils/dtos/responses/get-post.dto';

@Injectable()
export class PostMapper {
  fromDbToPost = (postDocument: PostDocument): GetPostDto => ({
    id: postDocument._id.toString(),
    title: postDocument.title,
    text: postDocument.text,
    author: postDocument.author,
    user: postDocument.userId,
    category: postDocument.category,
    comments: postDocument.comments,
    imageName: postDocument.imageName,
    timeToRead: postDocument.timeToRead,
  });
}
