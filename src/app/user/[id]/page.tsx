import { notFound, redirect } from 'next/navigation';

import getCurrentUser from '@/app/actions/getCurrentUser';
import getUserById from '@/app/actions/getUserById';
import ProfileClient from './ProfileClient';
import getPosts from '@/app/actions/getPosts';
import getNotifications from '@/app/actions/getNotifications';

export const dynamic = 'force-dynamic';

interface IParams {
  id?: string;
}

const UserPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/');
  }

  const { id } = params;

  if (!id) {
    notFound();
  }

  const profile = await getUserById(params);
  if (!profile) {
    notFound();
  }

  const posts = await getPosts(id);
  const notifications = await getNotifications();
  return (
    <ProfileClient
      profile={profile}
      currentUser={currentUser}
      posts={posts}
      notifications={notifications}
    />
  );
};

export default UserPage;
