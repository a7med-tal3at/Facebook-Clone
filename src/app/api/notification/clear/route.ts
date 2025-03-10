import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.redirect('/');
    }

    const cleared = await prisma.notification.deleteMany({
      where: {
        recipientId: user.id,
      },
    });

    return NextResponse.json(cleared);
  } catch (error: any) {
    console.error(error);
  }
}
