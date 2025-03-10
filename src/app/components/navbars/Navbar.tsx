'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { ImSearch } from 'react-icons/im';
import { IoMdNotifications } from 'react-icons/io';

import { UserContext } from '@/app/providers/UserProvider';
import useUserMenuModal from '@/app/hooks/useUserMenuModal';
import useNotificationsModal from '@/app/hooks/useNotificationsModal';
import { Notifications } from '@/app/types';

import Avatar from '../common/Avatar';
import UserMenu from '../menus/UserMenu';
import NotificationsModal from '../notifications/NotificationsModal';

interface NavbarProps {
  notifications: Notifications | null;
}

const Navbar: React.FC<NavbarProps> = ({ notifications }) => {
  const { user } = useContext(UserContext);
  const userMenu = useUserMenuModal();
  const handleMenu = () => {
    if (userMenu.isOpen) {
      userMenu.onClose();
    } else {
      userMenu.onOpen();
    }
  };

  const notifcationsModal = useNotificationsModal();
  const handleNotifications = () => {
    if (notifcationsModal.isOpen) {
      notifcationsModal.onClose();
    } else {
      notifcationsModal.onOpen();
    }
  };

  return (
    <div
      className="sticky z-40 flex flex-row px-4 py-2 lg:lg-layout-grid
      bg-white dark:bg-[#242526] border-t-0
      border-b border-neutral-300 dark:border-[#393b3d] shadow-sm"
    >
      <Link href="/">
        <h1 className="text-3xl font-bold text-[#1a77f2]">facebook</h1>
      </Link>

      <div
        className="md:flex-1 flex flex-row items-center gap-2 max-w-[680px] max-h-[40px] p-3 mx-4
        bg-neutral-100 dark:bg-[#3a3b3c] text-neutral-500 dark:text-neutral-400
        font-light rounded-full cursor-pointer duration-300
        hover:bg-neutral-200 dark:hover:bg-[#4e4f50] "
      >
        <ImSearch size={16} />
        <div className="hidden md:block">Search Facebook</div>
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto">
        <button
          onClick={handleNotifications}
          className="relative flex items-center justify-center w-10 h-10 
            bg-neutral-100 dark:bg-[#3a3b3c] text-black dark:text-[#e4e6eb] rounded-full 
            duration-300 hover:bg-neutral-200 dark:hover:bg-[#4e4f50]"
        >
          <IoMdNotifications size={26} />
          <NotificationsModal notifications={notifications} isOpen={notifcationsModal.isOpen} />
          {notifications && notifications.length > 0 && (
            <div className="z-50 absolute bottom-0 right-0 block w-3 h-3 bg-[#1A77F2] rounded-full"></div>
          )}
        </button>

        <button onClick={handleMenu} className="relative">
          <Avatar user={user} size={40} />
          <UserMenu currentUser={user} isOpen={userMenu.isOpen} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
