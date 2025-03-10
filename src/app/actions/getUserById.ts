import prisma from '@/app/lib/dbConnect';

interface IParams {
  id?: string;
}

export default async function getUserById(params: IParams) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        friendOf: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                image: true,
              },
            },
          },
        },
        profile: true,
      },
    });

    if (!user) throw new Error('User not found');

    const { friendOf, ...other } = user;

    const friends = friendOf.map((friend) => {
      const { profile, ...other } = friend;
      return {
        ...other,
        image: profile?.image,
      };
    });

    return {
      ...other,
      friends,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
