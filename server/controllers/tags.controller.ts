import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({ tags });
  } catch (error: any) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getTagBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Find tag by slug
    const tag = await prisma.tag.findUnique({
      where: { slug }
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Get posts with this tag
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          tags: {
            some: { slug }
          },
          status: 'PUBLISHED'
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
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
          tags: {
            some: { slug }
          },
          status: 'PUBLISHED'
        }
      })
    ]);

    res.json({
      tag,
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get tag error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createTag = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug } = req.body;

    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    });

    res.status(201).json({ tag });
  } catch (error: any) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug
      }
    });

    res.json({ tag });
  } catch (error: any) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tag.delete({
      where: { id }
    });

    res.json({ message: 'Tag deleted successfully' });
  } catch (error: any) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: error.message });
  }
};
