'use client';

import { useContext, useEffect } from 'react';

import setTheme from '../lib/theme';
import { Notifications, Posts, SafeUser, User } from '../types';
import { UserContext } from '../providers/UserProvider';

import ProfileCreator from './ProfileCreator';
import Navbar from '../components/navbars/Navbar';
import Sidebar from '../components/navbars/Sidebar';
import PostPrompt from '../components/posts/PostPrompt';
import Sponsored from '../components/home/Sponsored';
import PostCard from '../components/posts/PostCard';
import SuggestedFriends from '../components/home/SuggestedFriends';

interface HomeClientProps {
  currentUser: SafeUser;
  posts: Posts;
  suggestedFriends: User[] | null;
  notifications: Notifications | null;
}

const HomeClient: React.FC<HomeClientProps> = ({
  currentUser,
  posts,
  suggestedFriends,
  notifications,
}) => {
  useEffect(() => {
    setTheme();
  }, []);

  const { setUser } = useContext(UserContext);
  useEffect(() => {
    setUser({
      id: currentUser.id,
      name: currentUser.name,
      image: currentUser.profile?.image,
    });
  }, [currentUser.id, currentUser.name, currentUser.profile?.image, setUser]);

  if (!currentUser.profile) {
    return <ProfileCreator currentUser={currentUser} />;
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-40">
        <Navbar notifications={notifications} />
      </div>

      <div
        className="flex flex-row h-full
         lg:lg-layout-grid overflow-y-visible
        bg-[#f0f2f5] dark:bg-[#18191a]"
      >
        <Sidebar />
        <div
          className="lg:post-wall grow flex flex-col gap-2 xs:gap-4 max-w-[680px] overflow-x-hidden overflow-y-visible h-min
          mx-auto lg:mx-4 px-2 xs:px-4 lg:px-0 py-2 xs:py-4"
        >
          <PostPrompt />
          {suggestedFriends && suggestedFriends.length > 0 && (
            <SuggestedFriends suggestedFriends={suggestedFriends} />
          )}
          {posts === null ? (
            <div className="p-4 text-neutral-500">No posts found...</div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
        <Sponsored />
      </div>
    </div>
  );
};

export default HomeClient;
