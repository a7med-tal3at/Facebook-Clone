import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
  id: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { id } = params;
    const user = await getCurrentUser();

    if (!user) {
      alert('Session expired. Please log in again.');
      return NextResponse.redirect('/');
    }

    const comment = await prisma.comment.findFirst({
      where: {
        id,
        authorId: user.id,
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    const deletedComment = await prisma.comment.delete({
      where: {
        id,
      },
    });

    if (!deletedComment) {
      throw new Error('Comment not found');
    }

    return NextResponse.json(deletedComment);
  } catch (error: any) {
    console.error(error);
  }
}
