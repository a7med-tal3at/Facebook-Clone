import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import prisma from '@/app/lib/dbConnect';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('User not found');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,

          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid password');
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
