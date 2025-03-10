import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect('/');
    }

    const { content, postId } = await req.json();
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: user.id,
      },
    });

    if (!comment) {
      throw new Error('Error creating comment');
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId === user.id) {
      return NextResponse.json(comment);
    }

    await prisma.notification.create({
      data: {
        content: 'comment',
        recipientId: post.authorId,
        postId,
        authorId: user.id,
      },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    console.error(error);
  }
}
