import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cover } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.redirect('/');
    }

    const profile = await prisma.profile.update({
      where: {
        userId: currentUser.id,
      },
      data: {
        cover: cover,
        photos: {
          push: cover,
        },
      },
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error(error);
  }
}
