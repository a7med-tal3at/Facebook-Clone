import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
  postId: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect('/');
    }

    const { postId } = params;

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: user.id,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const deleted = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    if (!deleted) {
      throw new Error('Error deleting post');
    }

    return NextResponse.json(deleted);
  } catch (error: any) {
    console.error(error);
  }
}
