import prisma from '../lib/dbConnect';
import sanitizePosts from '../lib/sanitizePosts';

const getPosts = async (id: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
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

    if (!posts) {
      return null;
    }

    const safePosts = sanitizePosts(posts);

    return safePosts;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getPosts;
