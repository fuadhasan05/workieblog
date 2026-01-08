import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { SavedArticle, Post } from '../models/mongodb.js';
import mongoose from 'mongoose';

export const saveArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { postId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Check if article exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if already saved
    const existing = await SavedArticle.findOne({
      memberId: new mongoose.Types.ObjectId(req.user.userId),
      postId: new mongoose.Types.ObjectId(postId)
    });

    if (existing) {
      return res.status(400).json({ error: 'Article already saved' });
    }

    // Save article
    const savedArticle = await SavedArticle.create({
      memberId: new mongoose.Types.ObjectId(req.user.userId),
      postId: new mongoose.Types.ObjectId(postId)
    });

    // Populate post info
    const populatedSavedArticle = await SavedArticle.findById(savedArticle._id)
      .populate({
        path: 'postId',
        select: 'slug title excerpt featuredImage publishedAt readTime',
        populate: {
          path: 'categoryId',
          select: 'name slug'
        }
      })
      .lean();

    res.status(201).json({ 
      savedArticle: {
        ...populatedSavedArticle,
        id: populatedSavedArticle!._id.toString(),
        post: populatedSavedArticle!.postId
      }
    });
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

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const result = await SavedArticle.findOneAndDelete({
      memberId: new mongoose.Types.ObjectId(req.user.userId),
      postId: new mongoose.Types.ObjectId(postId)
    });

    if (!result) {
      return res.status(404).json({ error: 'Saved article not found' });
    }

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

    const savedArticles = await SavedArticle.find({
      memberId: new mongoose.Types.ObjectId(req.user.userId)
    })
      .populate({
        path: 'postId',
        select: 'slug title excerpt featuredImage publishedAt readTime accessLevel',
        populate: [
          { path: 'categoryId', select: 'name slug' },
          { path: 'authorId', select: 'name avatar' }
        ]
      })
      .sort({ savedAt: -1 })
      .lean();

    // Transform to match expected format
    const transformedSavedArticles = savedArticles.map((item: any) => ({
      id: item._id.toString(),
      savedAt: item.savedAt,
      post: item.postId ? {
        id: item.postId._id.toString(),
        slug: item.postId.slug,
        title: item.postId.title,
        excerpt: item.postId.excerpt,
        featuredImage: item.postId.featuredImage,
        publishedAt: item.postId.publishedAt,
        readTime: item.postId.readTime,
        accessLevel: item.postId.accessLevel,
        category: item.postId.categoryId ? {
          name: item.postId.categoryId.name,
          slug: item.postId.categoryId.slug
        } : null,
        author: item.postId.authorId ? {
          name: item.postId.authorId.name,
          avatar: item.postId.authorId.avatar
        } : null
      } : null
    }));

    res.json({ savedArticles: transformedSavedArticles });
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

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.json({ isSaved: false });
    }

    const savedArticle = await SavedArticle.findOne({
      memberId: new mongoose.Types.ObjectId(req.user.userId),
      postId: new mongoose.Types.ObjectId(postId)
    });

    res.json({ isSaved: !!savedArticle });
  } catch (error: any) {
    console.error('Check if saved error:', error);
    res.status(500).json({ error: error.message });
  }
};
