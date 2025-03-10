'use client';

import Link from 'next/link';
import Image from 'next/image';

import { User } from '@/app/types/';

interface AvatarProps {
  user: User;
  size: number;
  button?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ user, size, button = false }) => {
  return (
    <>
      {button ? (
        <Link href={`/user/${user.id}`}>
          <Image
            src={user.image || '/assets/user.jpg'}
            alt="profile picture"
            className="object-cover rounded-full aspect-square"
            width={size}
            height={size}
          />
        </Link>
      ) : (
        <Image
          src={user.image || '/assets/user.jpg'}
          alt="profile picture"
          className="object-cover rounded-full aspect-square"
          width={size}
          height={size}
        />
      )}
    </>
  );
};

export default Avatar;
