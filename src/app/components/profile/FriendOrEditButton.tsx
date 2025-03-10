'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MdModeEditOutline } from 'react-icons/md';
import { BsPersonCheckFill, BsPersonDashFill, BsPersonPlusFill } from 'react-icons/bs';

import { UserContext } from '@/app/providers/UserProvider';
import { UserProfile } from '@/app/types';
import useProfileModal from '@/app/hooks/useProfileModal';

interface FriendOrEditButtonProps {
  profile: UserProfile;
  isFriend: boolean;
}

const FriendOrEditButton: React.FC<FriendOrEditButtonProps> = ({ profile, isFriend }) => {
  const { user } = useContext(UserContext);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const router = useRouter();

  const [buttonText, setButtonText] = useState<string>('Friends');

  const handleRemoveFriendButton = () => {
    if (buttonText === 'Friends') {
      return setButtonText('Remove');
    }
    setButtonText('Friends');
  };

  const [isSending, setIsSending] = useState<boolean>(false);

  const handleAddFriend = async () => {
    setIsSending(true);

    await axios
      .post(`/api/user/${profile.id}/add`)
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

  const handleRemoveFriend = async () => {
    setIsSending(true);

    await axios
      .post(`/api/user/${profile.id}/remove`)
      .then(() => {
        toast.success('Friend removed');

        router.refresh();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const profileModal = useProfileModal();
  return (
    <div className="flex gap-2 md:ml-auto md:mt-auto">
      {profile.id === user.id ? (
        <button
          onClick={profileModal.onOpen}
          className="flex flex-row items-center gap-2 px-4 py-2
          md:ml-auto md:mt-auto rounded
          text-black dark:text-[#e4e6eb]
          bg-neutral-200 dark:bg-[#3a3b3c]
          duration-300 hover:bg-neutral-300 dark:hover:bg-[#4e4f50]"
        >
          <MdModeEditOutline size={20} />
          <div>Edit profile</div>
        </button>
      ) : isFriend ? (
        isMobile ? (
          <>
            <button
              disabled={true}
              className="flex flex-row items-center gap-2 px-4 py-2
              text-white bg-[#35a420] rounded cursor-not-allowed"
            >
              <BsPersonCheckFill size={20} />
              <div>{buttonText}</div>
            </button>

            <button
              disabled={isSending}
              onClick={handleRemoveFriend}
              className="flex flex-row items-center gap-2 px-4 py-2
            bg-neutral-500 dark:bg-[#3a3b3c] text-white
            dark:hover:bg-[#4e4f50] rounded"
            >
              <BsPersonDashFill size={20} />
              <div>Remove</div>
            </button>
          </>
        ) : (
          <button
            disabled={isSending}
            onMouseEnter={handleRemoveFriendButton}
            onMouseLeave={handleRemoveFriendButton}
            onClick={handleRemoveFriend}
            className="flex flex-row items-center gap-2 w-[120px]
            px-4 py-2 bg-[#35a420] text-white 
            duration-300 hover:bg-red-600 rounded"
          >
            {buttonText === 'Friends' ? (
              <BsPersonCheckFill size={20} />
            ) : (
              <BsPersonDashFill size={20} />
            )}
            <div>{buttonText}</div>
          </button>
        )
      ) : (
        <button
          disabled={isSending}
          onClick={handleAddFriend}
          className="flex flex-row items-center gap-2 px-4 py-2
          text-white bg-[#1b74e4]
          duration-300 hover:bg-[#1663c2] rounded"
        >
          <BsPersonPlusFill size={20} />
          <div>Add Friend</div>
        </button>
      )}
    </div>
  );
};

export default FriendOrEditButton;
