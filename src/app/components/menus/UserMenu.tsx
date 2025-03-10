'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { BsFillMoonFill, BsSunFill } from 'react-icons/bs';
import { MdAutorenew } from 'react-icons/md';

import { User } from '@/app/types';
import useUserMenuModal from '@/app/hooks/useUserMenuModal';
import useThemeModal from '@/app/hooks/useThemeModal';

import Avatar from '../common/Avatar';

interface UserMenuProps {
  currentUser: User;
  isOpen: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, isOpen }) => {
  const router = useRouter();

  const userMenu = useUserMenuModal();

  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          userMenu.onClose();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen, userMenu]);

  const handleGoToProfile = () => {
    userMenu.onClose();
    router.push(`/user/${currentUser.id}`);
  };

  const themeModal = useThemeModal();

  const handleThemeModalOpen = () => {
    userMenu.onClose();
    themeModal.onOpen();
  };

  const currentTheme = localStorage.getItem('theme');

  return (
    <>
      {isOpen && (
        <ul
          ref={menuRef}
          onClick={(e: React.MouseEvent<HTMLUListElement>) => e.stopPropagation()}
          className="absolute top-[48px] -right-4 sm:right-0
          flex flex-col gap-2 p-4 w-screen sm:w-[300px]
        bg-white dark:bg-[#242526] text-black dark:text-[#e4e6eb]
          border border-x-0 sm:border-x border-neutral-300 dark:border-[#393b3d]
          md:rounded-md shadow-2xl "
        >
          <div
            role="button"
            onClick={handleGoToProfile}
            className="p-1 border border-neutral-300 dark:border-[#393b3d] rounded-md shadow-md"
          >
            <div
              className="flex flex-row items-center gap-2 p-3
              rounded-md duration-300 hover:bg-neutral-200 dark:hover:bg-[#3a3b3c]"
            >
              <Avatar user={currentUser} size={36} />

              <div>{currentUser.name}</div>
            </div>
          </div>

          <div
            role="button"
            onClick={() => signOut()}
            className="flex flex-row items-center gap-2 px-4
            rounded-md duration-300 hover:bg-neutral-200 dark:hover:bg-[#3a3b3c]"
          >
            <div
              className="flex flex-row items-center justify-center w-9 h-9
              bg-neutral-200 dark:bg-[#3a3b3c] rounded-full "
            >
              <RiLogoutBoxRFill size={24} />
            </div>
            <div>Log Out</div>
          </div>

          <div
            role="button"
            onClick={handleThemeModalOpen}
            className="flex flex-row items-center gap-2 px-4
            rounded-md duration-300 hover:bg-neutral-200 dark:hover:bg-[#3a3b3c]"
          >
            <div
              className="flex flex-row items-center justify-center w-9 h-9
              bg-neutral-200 dark:bg-[#3a3b3c] rounded-full"
            >
              {currentTheme === 'dark' ? (
                <BsFillMoonFill size={24} />
              ) : currentTheme === 'light' ? (
                <BsSunFill size={24} />
              ) : (
                <MdAutorenew size={24} />
              )}
            </div>
            <div>Theme</div>
          </div>
        </ul>
      )}
    </>
  );
};

export default UserMenu;
