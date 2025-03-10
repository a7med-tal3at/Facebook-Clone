import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, job, education, bio } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.redirect('/');
    }

    const profile = await prisma.profile.update({
      where: {
        userId: currentUser.id,
      },
      data: {
        location,
        job,
        education,
        bio,
      },
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error(error);
  }
}
