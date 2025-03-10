import { DateTime } from 'luxon';

import { Posts } from '../types';

const sanitizePosts = (posts: any): Posts => {
  const safePosts = posts.map((post: any) => {
    const { createdAt, comments, likes, author, authorId, ...otherProps } = post;
    const postAuthor = {
      id: author.id,
      name: author.name,
      image: author.profile?.image,
    };

    const safeComments = comments.map((comment: any) => {
      const { createdAt, authorId, author, ...otherCommentProps } = comment;

      const commentAuthor = {
        id: author.id,
        name: author.name,
        image: author.profile?.image,
      };

      return {
        ...otherCommentProps,
        author: commentAuthor,
        createdAt: DateTime.fromJSDate(createdAt).toLocaleString(DateTime.DATETIME_MED),
      };
    });

    const safeLikes = likes.map((like: any) => {
      const { author } = like;

      const likeAuthor = {
        id: author.id,
        name: author.name,
        image: author.profile?.image,
      };

      return {
        author: likeAuthor,
      };
    });

    return {
      ...otherProps,
      author: postAuthor,
      createdAt: DateTime.fromJSDate(createdAt).toLocaleString(DateTime.DATETIME_MED),
      comments: safeComments,
      likes: safeLikes,
    };
  });

  return safePosts;
};

export default sanitizePosts;
