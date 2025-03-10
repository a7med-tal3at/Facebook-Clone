'use client';

import { SafeUser, UserProfile } from '@/app/types';
import Amigo from './Amigo';

interface FriendsProps {
  profile: UserProfile;
  user: SafeUser;
}

const AllFriends: React.FC<FriendsProps> = ({ profile, user }) => {
  const { friends } = profile;
  return (
    <div
      className="flex flex-col gap-2 w-full p-4
      bg-white dark:bg-[#242526]
      border dark:border-0 border-neutral-300 rounded-md shadow-sm "
    >
      <h1 className="text-2xl font-semibold text-black dark:text-[#e4e6eb]">Friends</h1>
      <div className="font-light text-neutral-500 dark:text-neutral-400">
        {friends.length} friend{friends.length === 1 ? '' : 's'}
      </div>

      <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 xs:gap-4 grid-auto-rows">
        {friends.map((friend) => (
          <Amigo key={friend.id} friend={friend} user={user} />
        ))}
      </div>
    </div>
  );
};

export default AllFriends;
