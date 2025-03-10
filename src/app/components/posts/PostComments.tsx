'use client';

import { useState } from 'react';
import { Comment } from '@/app/types';
import SingleComment from './Comment';

interface PostCommentsProps {
  comments: Comment[];
}

const PostComments: React.FC<PostCommentsProps> = ({ comments }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {comments.length > 0 && (
        <>
          {comments.length > 1 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="pt-2 text-neutral-500 text-start hover:underline"
            >
              {isOpen
                ? 'Collapse comments'
                : `View ${comments.length - 1} more comment${comments.length > 2 ? 's' : ''}`}
            </button>
          )}

          {!isOpen ? (
            <SingleComment comment={comments[0]} />
          ) : (
            comments.map((comment) => <SingleComment key={comment.id} comment={comment} />)
          )}
        </>
      )}
    </>
  );
};

export default PostComments;
