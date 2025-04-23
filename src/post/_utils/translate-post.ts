import { translate } from 'google-translate-api-browser';
import { PostWithLikeInterface } from './interfaces/post-with-like.interface';
import { LangKey } from 'google-translate-api-browser/dest/types/LangKey';
import { translateComment } from '../../comment/_utils/translate-comment';

export const translatePost = async (
  post: PostWithLikeInterface,
  language: LangKey = 'fr',
) => {
  const title = await translate(post.title, {
    from: 'auto',
    to: language,
  });
  const content = await translate(post.text, {
    from: 'auto',
    to: language,
  });
  post.text = content.text;
  post.title = title.text;
  await translateComment(post.comments, language);
  return post;
};
