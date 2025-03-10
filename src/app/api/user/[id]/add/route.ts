import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
  id: string;
}

export async function POST(req: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.redirect('/');
    }

    const { id } = params;
    const friends = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        friends: true,
      },
    });

    if (!friends) {
      throw new Error('User not found');
    }

    if (friends.friends.some((friend) => friend.id === id)) {
      return NextResponse.redirect(`/user/${id}`);
    }

    const friendship = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        friends: {
          connect: {
            id,
          },
        },
      },
    });

    if (!friendship) {
      throw new Error('Error adding friend');
    }

    const friendship2 = await prisma.user.update({
      where: {
        id,
      },
      data: {
        friends: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    if (!friendship2) {
      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          friends: {
            disconnect: {
              id,
            },
          },
        },
      });

      throw new Error('Error adding friend');
    }

    await prisma.notification.create({
      data: {
        content: 'friend',
        recipientId: id,
        authorId: currentUser.id,
      },
    });

    return NextResponse.json(friendship);
  } catch (error: any) {
    console.error(error);
  }
}
