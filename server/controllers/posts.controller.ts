import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      category,
      authorId,
      search,
      startDate,
      endDate,
      tags
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    // Enhanced search: title, excerpt, and content
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Date range filtering
    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) {
        where.publishedAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.publishedAt.lte = new Date(endDate as string);
      }
    }

    // Tag filtering
    if (tags) {
      const tagArray = (tags as string).split(',');
      where.tags = {
        some: {
          slug: { in: tagArray }
        }
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          category: true,
          tags: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.post.count({ where })
    ]);

    res.json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Support both ID and slug lookup
    // Check if the parameter looks like a UUID (ID) or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const post = await prisma.post.findUnique({
      where: isUUID ? { id } : { slug: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true
          }
        },
        category: true,
        tags: true
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post });
  } catch (error: any) {
    console.error('Get post error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      status,
      publishedAt,
      scheduledFor,
      categoryId,
      tagIds,
      isFeatured,
      isPremium,
      readTime
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (existingPost) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : publishedAt,
        scheduledFor,
        authorId: req.user.userId,
        categoryId,
        isFeatured: isFeatured || false,
        isPremium: isPremium || false,
        readTime,
        tags: tagIds ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        category: true,
        tags: true
      }
    });

    res.status(201).json({ post });
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      status,
      publishedAt,
      scheduledFor,
      categoryId,
      tagIds,
      isFeatured,
      isPremium,
      readTime
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check permissions
    if (
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'EDITOR' &&
      existingPost.authorId !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Check if new slug already exists
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        status,
        publishedAt: status === 'PUBLISHED' && !existingPost.publishedAt
          ? new Date()
          : publishedAt,
        scheduledFor,
        categoryId,
        isFeatured,
        isPremium,
        readTime,
        tags: tagIds ? {
          set: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        category: true,
        tags: true
      }
    });

    res.json({ post });
  } catch (error: any) {
    console.error('Update post error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check permissions
    if (
      req.user.role !== 'ADMIN' &&
      existingPost.authorId !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const incrementPostViews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    });

    res.json({ post });
  } catch (error: any) {
    console.error('Increment views error:', error);
    res.status(500).json({ error: error.message });
  }
};
