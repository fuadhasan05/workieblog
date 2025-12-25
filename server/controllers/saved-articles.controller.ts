import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const saveArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { postId } = req.body;

    // Check if article exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if already saved
    const existing = await prisma.savedArticle.findUnique({
      where: {
        memberId_postId: {
          memberId: req.user.userId,
          postId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Article already saved' });
    }

    // Save article
    const savedArticle = await prisma.savedArticle.create({
      data: {
        memberId: req.user.userId,
        postId
      },
      include: {
        post: {
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true,
            readTime: true,
            category: true
          }
        }
      }
    });

    res.status(201).json({ savedArticle });
  } catch (error: any) {
    console.error('Save article error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const unsaveArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { postId } = req.params;

    await prisma.savedArticle.delete({
      where: {
        memberId_postId: {
          memberId: req.user.userId,
          postId
        }
      }
    });

    res.json({ message: 'Article unsaved successfully' });
  } catch (error: any) {
    console.error('Unsave article error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getSavedArticles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const savedArticles = await prisma.savedArticle.findMany({
      where: {
        memberId: req.user.userId
      },
      include: {
        post: {
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true,
            readTime: true,
            accessLevel: true,
            category: {
              select: {
                name: true,
                slug: true
              }
            },
            author: {
              select: {
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: {
        savedAt: 'desc'
      }
    });

    res.json({ savedArticles });
  } catch (error: any) {
    console.error('Get saved articles error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const checkIfSaved = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ isSaved: false });
    }

    const { postId } = req.params;

    const savedArticle = await prisma.savedArticle.findUnique({
      where: {
        memberId_postId: {
          memberId: req.user.userId,
          postId
        }
      }
    });

    res.json({ isSaved: !!savedArticle });
  } catch (error: any) {
    console.error('Check if saved error:', error);
    res.status(500).json({ error: error.message });
  }
};
