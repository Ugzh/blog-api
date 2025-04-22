import { Injectable } from '@nestjs/common';
import { GetPostDto } from './_utils/dtos/responses/get-post.dto';
import { PostWithLikeInterface } from './_utils/interfaces/post-with-like.interface';

@Injectable()
export class PostMapper {
  fromDbToPost = (postWithLikes: PostWithLikeInterface): GetPostDto => ({
    id: postWithLikes._id.toString(),
    title: postWithLikes.title,
    text: postWithLikes.text,
    author: postWithLikes.author,
    user: postWithLikes.user,
    nbLikes: postWithLikes.nbLikes,
    category: postWithLikes.category,
    comments: postWithLikes.comments,
    image_url: postWithLikes.image_url,
    timeToRead: postWithLikes.timeToRead,
  });
}
