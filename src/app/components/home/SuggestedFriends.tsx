'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BsPersonPlusFill } from 'react-icons/bs';
import { User } from '@/app/types';

interface SuggestedFriendsProps {
  suggestedFriends: User[];
}

const SuggestedFriends: React.FC<SuggestedFriendsProps> = ({ suggestedFriends }) => {
  const router = useRouter();
  const [isSending, setIsSending] = useState<boolean>(false);
  const handleAddFriend = async (id: string) => {
    setIsSending(true);

    await axios
      .post(`/api/user/${id}/add`)
      .then(() => {
        toast.success('Friend added!');
        router.refresh();
      })
      .catch(() => {
        toast.error('Error adding friend');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div
      className="flex flex-col w-full gap-2 bg-white dark:bg-[#242526]
      border dark:border-0 border-neutral-300 rounded-md shadow-sm "
    >
      <h1 className="px-4 pt-4 text-xl font-medium text-black dark:text-[#e4e6eb]">
        Suggested Friends
      </h1>

      <div className="suggested-grid">
        {suggestedFriends.map((user) => (
          <div
            key={user.id}
            className="flex flex-col overflow-hidden
            border border-neutral-300 dark:border-[#3a3b3c] rounded-md shadow-lg"
          >
            <Link
              href={`/user/${user.id}`}
              className="relative w-full overflow-hidden aspect-square"
            >
              <Image
                src={user.image || '/assets/user.jpg'}
                alt="suggested user photo"
                className="object-cover duration-300 hover:scale-110"
                fill
              />
            </Link>

            <div className="flex flex-col justify-between flex-1 gap-1 p-3 pt-1">
              <div className="text-black dark:text-[#e4e6eb] truncate">{user.name}</div>
              <button
                onClick={() => handleAddFriend(user.id)}
                disabled={isSending}
                className="flex justify-center items-center gap-2 py-1 px-2 mt-auto
                rounded-md whitespace-nowrap bg-[#e7f3ff] dark:bg-[#263951]
                text-[#1b74e4] dark:text-[#2d86ff] duration-300
                hover:bg-[#d1dce7] dark:hover:bg-[#2f4764]"
              >
                <BsPersonPlusFill size={20} />
                <div>Add Friend</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriends;
