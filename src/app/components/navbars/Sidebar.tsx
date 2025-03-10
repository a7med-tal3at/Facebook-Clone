'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import { MdHome } from 'react-icons/md';

import { UserContext } from '@/app/providers/UserProvider';

import Avatar from '../common/Avatar';

interface SidebarProps {
  profile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ profile = false }) => {
  const { user } = useContext(UserContext);
  const [selected, setSelected] = useState<String>(profile ? 'User' : 'Home');
  return (
    <div
      className={`
        z-0 sticky top-[57px] hidden sm:flex flex-col gap-2 px-2 py-4 sidebar
        bg-white dark:bg-[#242526] text-black dark:text-neutral-400 
        border-r lg:border-r-0 border-neutral-300 dark:border-[#393b3d]
        ${!profile && 'lg:w-[180px] lg:!bg-transparent'}
        ${profile && 'lg:!flex-initial bg-white dark:bg-[#242526] lg:!border-r'}
      `}
    >
      <Link
        href="/"
        onClick={() => setSelected('Home')}
        className={`
          relative flex flex-row items-center gap-2 p-2  
          rounded-md cursor-pointer
          duration-300 hover:bg-neutral-200 dark:hover:bg-[#3a3b3c] 
          ${selected === 'Home' ? 'sidebar-selected' : ''}
        `}
      >
        <MdHome
          size={26}
          className={`
            ${selected === 'Home' ? 'text-[#1a77f2]' : 'text-black dark:text-[#e4e6eb]'}
          `}
        />
        <div
          className={`
            hidden lg:block
            ${profile && 'lg:!hidden'}
          `}
        >
          Home
        </div>
      </Link>

      <Link
        href={`/user/${user.id}`}
        onClick={() => setSelected('User')}
        className={`
          relative flex flex-row items-center gap-2 p-2
          rounded-md cursor-pointer duration-300
          hover:bg-neutral-200 dark:hover:bg-[#3a3b3c] 
          ${selected === 'User' && 'sidebar-selected'}
        `}
      >
        <Avatar user={user} size={26} />

        <div
          className={`
            hidden lg:block whitespace-normal
            ${profile && 'lg:!hidden'}
          `}
        >
          {user.name}
        </div>
      </Link>

      <hr className="border-neutral-300 dark:border-[#393a3b]" />
    </div>
  );
};

export default Sidebar;
