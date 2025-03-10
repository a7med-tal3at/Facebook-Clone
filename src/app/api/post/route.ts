import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/lib/dbConnect';

export async function POST(req: Request) {
  try {
    const { content, postImage } = await req.json();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.redirect('/');
    }

    const post = await prisma.post.create({
      data: {
        content,
        postImage,
        authorId: currentUser.id,
      },
    });

    if (!post) {
      throw new Error('Error creating post');
    }

    if (postImage) {
      const image = await prisma.profile.update({
        where: {
          userId: currentUser.id,
        },
        data: {
          photos: {
            push: postImage,
          },
        },
      });

      if (!image) {
        throw new Error('Error adding image to profile');
      }
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error(error);
  }
}
