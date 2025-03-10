'use client';

import { useContext } from 'react';

import { UserContext } from '@/app/providers/UserProvider';
import usePostModal from '@/app/hooks/usePostModal';
import Avatar from '../common/Avatar';

const PostPrompt = () => {
  const { user } = useContext(UserContext);
  const postModal = usePostModal();
  return (
    <div
      className="flex flex-col gap-2 p-4
      bg-white dark:bg-[#242526]
      border border-neutral-300 dark:border-0
      rounded-md shadow-sm"
    >
      <div className="flex flex-row items-center gap-2">
        <Avatar user={user} size={40} button />
        <button
          onClick={postModal.onOpen}
          className="flex-1 p-3 text-start font-light
          text-neutral-500 dark:text-neutral-400 
          bg-neutral-100 dark:bg-[#3a3b3c] rounded-full
          duration-300 hover:bg-neutral-200 dark:hover:bg-[#4e4f50]"
        >
          What&#39;s on your mind, {user.name.split(' ')[0]}?
        </button>
      </div>
    </div>
  );
};

export default PostPrompt;
