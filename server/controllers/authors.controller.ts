import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const getAuthors = async (req: AuthRequest, res: Response) => {
  try {
    const authors = await prisma.user.findMany({
      where: {
        posts: {
          some: {
            status: 'PUBLISHED'
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        _count: {
          select: {
            posts: {
              where: { status: 'PUBLISHED' }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({ authors });
  } catch (error: any) {
    console.error('Get authors error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAuthorBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Find author by ID (using slug as ID for simplicity)
    const author = await prisma.user.findUnique({
      where: { id: slug },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true
      }
    });

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Get author's published posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: slug,
          status: 'PUBLISHED'
        },
        include: {
          category: true,
          tags: true
        },
        orderBy: {
          publishedAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.post.count({
        where: {
          authorId: slug,
          status: 'PUBLISHED'
        }
      })
    ]);

    res.json({
      author,
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get author error:', error);
    res.status(500).json({ error: error.message });
  }
};
