import { CommentWithLikeInterface } from './interfaces/comment-with-like.interface';
import { translate } from 'google-translate-api-browser';
import { LangKey } from 'google-translate-api-browser/dest/types/LangKey';

export const translateComment = async (
  comments: CommentWithLikeInterface[],
  language: LangKey = 'en',
) => {
  for (const comment of comments) {
    const content = await translate(comment.comment, {
      from: 'auto',
      to: language,
    });
    comment.comment = content.text;
  }
  return comments;
};
