import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, location, job, education, bio, image } = body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.profile) {
      throw new Error('Profile already exists');
    }

    const profile = await prisma.profile.create({
      data: {
        userId,
        location,
        job,
        education,
        bio,
        image,
        photos: [image],
      },
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error(error);
  }
}
