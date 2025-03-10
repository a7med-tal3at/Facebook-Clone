import getCurrentUser from './actions/getCurrentUser';

import LoginClient from './login/LoginClient';
import HomeClient from './home/HomeClient';
import getAllPosts from './actions/getAllPosts';
import getSuggestedFriends from './actions/getSuggestedFriends';
import getNotifications from './actions/getNotifications';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const currentUser = await getCurrentUser();

  if (!currentUser) return <LoginClient />;

  const posts = await getAllPosts();

  const suggestedFriends = await getSuggestedFriends();

  const notifications = await getNotifications();

  return (
    <HomeClient
      currentUser={currentUser}
      posts={posts}
      suggestedFriends={suggestedFriends}
      notifications={notifications}
    />
  );
}
