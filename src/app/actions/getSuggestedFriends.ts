import prisma from '@/app/lib/dbConnect';
import getCurrentUser from './getCurrentUser';

const getSuggestedFriends = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }
    const allOtherUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: user.friendsIds,
          not: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    const allOtherUsersIds = allOtherUsers.map((user) => user.id);
    const randomUserIds = fisherYatesShuffle(allOtherUsersIds).slice(0, 5);
    const suggested = await prisma.user.findMany({
      where: {
        id: {
          in: randomUserIds,
        },
      },
      select: {
        id: true,
        name: true,
        profile: {
          select: {
            image: true,
          },
        },
      },
    });

    const suggestedFriends = suggested.map((friend) => {
      const { profile, ...otherProps } = friend;
      return {
        ...otherProps,
        image: profile?.image,
      };
    });
    return suggestedFriends;
  } catch (error) {
    console.error(error);
    return null;
  }
};

function fisherYatesShuffle(array: string[]) {
  let count = array.length;
  while (count) {
    let index = Math.floor(Math.random() * count--);
    let temp = array[count];
    array[count] = array[index];
    array[index] = temp;
  }

  return array;
}

export default getSuggestedFriends;
