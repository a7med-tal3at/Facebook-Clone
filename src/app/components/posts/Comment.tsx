'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { UserContext } from '@/app/providers/UserProvider';
import { Comment as TComment } from '@/app/types';

import Avatar from '../common/Avatar';
import Link from 'next/link';

interface CommentProps {
  comment: TComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const handleDeleteComment = async () => {
    await axios
      .delete(`/api/comment/${comment.id}`)
      .then(() => {
        toast.success('Comment deleted successfully!');
        router.refresh();
      })
      .catch(() => {
        toast.error('Error deleting comment');
      });
  };

  return (
    <div className="flex gap-2 pt-2 group">
      <Avatar user={comment.author} size={36} button />
      <div className="flex flex-col flex-1">
        <Link
          href={`/user/${comment.author.id}`}
          className="max-w-min text-sm whitespace-nowrap
          text-black dark:text-[#e4e6eb] hover:underline"
        >
          {comment.author.name}
        </Link>

        <div className="text-sm text-black dark:text-[#e4e6eb]">{comment.content}</div>
        <div className="flex gap-2 text-neutral-500 dark:text-neutral-400">
          <div className="text-xs font-light">{comment.createdAt}</div>
          {comment.author.id === user.id && (
            <button
              onClick={handleDeleteComment}
              className="hidden ml-auto text-xs hover:underline group-hover:block"
            >
              Delete comment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
