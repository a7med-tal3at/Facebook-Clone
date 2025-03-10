import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import prisma from '@/app/lib/dbConnect';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.redirect('/');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        hashedPassword,
      },
    });

    if (!user) {
      throw new Error('Error creating user');
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error);
  }
}
