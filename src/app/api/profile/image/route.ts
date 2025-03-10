import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.redirect('/');
    }

    const profile = await prisma.profile.update({
      where: {
        userId: currentUser.id,
      },
      data: {
        image,
        photos: {
          push: image,
        },
      },
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error(error);
  }
}
