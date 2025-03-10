import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect('/');
    }

    const { postId } = await req.json();
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const like = await prisma.like.findFirst({
      where: {
        postId,
        authorId: user.id,
      },
    });

    if (like) {
      const deleted = await prisma.like.delete({
        where: {
          id: like.id,
        },
      });

      if (!deleted) {
        throw new Error('Error unliking post');
      }

      return NextResponse.json({ status: 204 });
    } else {
      const liked = await prisma.like.create({
        data: {
          postId,
          authorId: user.id,
        },
      });

      if (!liked) {
        throw new Error('Error liking post');
      }

      if (post.authorId === user.id) {
        return NextResponse.json({ status: 201 });
      }

      await prisma.notification.create({
        data: {
          content: 'like',
          recipientId: post.authorId,
          authorId: user.id,
          postId: post.id,
        },
      });

      return NextResponse.json({ status: 201 });
    }
  } catch (error: any) {
    console.error(error);
  }
}
