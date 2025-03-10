import prisma from '../lib/dbConnect';
import getCurrentUser from './getCurrentUser';
import sanitizePosts from '../lib/sanitizePosts';

const getAllPosts = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error('No user found');
    }

    const userIds = currentUser.friendsIds;

    userIds.push(currentUser.id);

    const allPosts = await prisma.post.findMany({
      where: {
        authorId: {
          in: userIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 25,
      include: {
        author: {
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
        likes: {
          select: {
            author: {
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
          },
        },
        comments: {
          include: {
            author: {
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
          },
        },
      },
    });

    if (!allPosts) {
      throw new Error('No posts found');
    }

    const safePosts = sanitizePosts(allPosts);

    return safePosts;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getAllPosts;
