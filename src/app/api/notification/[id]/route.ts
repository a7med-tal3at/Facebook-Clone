import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
  id: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect('/');
    }

    const { id } = params;
    const notification = await prisma.notification.delete({
      where: {
        id: id,
      },
    });

    if (!notification) {
      throw new Error('Error deleting notification');
    }

    return NextResponse.json(notification);
  } catch (error: any) {
    console.error(error);
  }
}
