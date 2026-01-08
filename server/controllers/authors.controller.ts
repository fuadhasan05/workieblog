import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User, Post } from '../models/mongodb.js';
import mongoose from 'mongoose';

export const getAuthors = async (req: AuthRequest, res: Response) => {
  try {
    // Get all users who have published posts
    const authorsWithPosts = await Post.aggregate([
      { $match: { status: 'PUBLISHED' } },
      { $group: { _id: '$authorId', postCount: { $sum: 1 } } }
    ]);

    const authorIds = authorsWithPosts.map(a => a._id);
    const postCountMap = new Map(authorsWithPosts.map(a => [a._id.toString(), a.postCount]));

    const authors = await User.find({ _id: { $in: authorIds } })
      .select('name email avatar bio')
      .sort({ name: 1 })
      .lean();

    // Transform authors with post counts
    const transformedAuthors = authors.map(author => ({
      id: author._id.toString(),
      name: author.name,
      email: author.email,
      avatar: author.avatar,
      bio: author.bio,
      _count: {
        posts: postCountMap.get(author._id.toString()) || 0
      }
    }));

    res.json({ authors: transformedAuthors });
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

    // Try to find author by ID (using slug as ID for simplicity)
    if (!mongoose.Types.ObjectId.isValid(slug)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const author = await User.findById(slug)
      .select('name email avatar bio')
      .lean();

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Get author's published posts with pagination
    const [posts, total] = await Promise.all([
      Post.find({
        authorId: new mongoose.Types.ObjectId(slug),
        status: 'PUBLISHED'
      })
        .populate('categoryId')
        .populate('tags')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Post.countDocuments({
        authorId: new mongoose.Types.ObjectId(slug),
        status: 'PUBLISHED'
      })
    ]);

    // Transform posts
    const transformedPosts = posts.map((post: any) => ({
      ...post,
      id: post._id.toString(),
      category: post.categoryId,
      tags: post.tags
    }));

    res.json({
      author: {
        id: author._id.toString(),
        name: author.name,
        email: author.email,
        avatar: author.avatar,
        bio: author.bio
      },
      posts: transformedPosts,
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
