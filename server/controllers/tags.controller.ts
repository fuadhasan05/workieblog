import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Tag, Post } from '../models/mongodb.js';
import mongoose from 'mongoose';

export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    // Get all tags
    const tags = await Tag.find().sort({ name: 1 }).lean();

    // Get post counts for each tag
    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await Post.countDocuments({ tags: tag._id });
        return {
          ...tag,
          id: tag._id.toString(),
          _count: {
            posts: postCount
          }
        };
      })
    );

    res.json({ tags: tagsWithCount });
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
    const tag = await Tag.findOne({ slug }).lean();

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Get posts with this tag
    const [posts, total] = await Promise.all([
      Post.find({
        tags: tag._id,
        status: 'PUBLISHED'
      })
        .populate('authorId', 'name avatar')
        .populate('categoryId')
        .populate('tags')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Post.countDocuments({
        tags: tag._id,
        status: 'PUBLISHED'
      })
    ]);

    // Transform posts to match expected format
    const transformedPosts = posts.map((post: any) => ({
      ...post,
      id: post._id.toString(),
      author: post.authorId ? {
        id: post.authorId._id.toString(),
        name: post.authorId.name,
        avatar: post.authorId.avatar
      } : null,
      category: post.categoryId,
      tags: post.tags
    }));

    res.json({
      tag: {
        ...tag,
        id: tag._id.toString()
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
    console.error('Get tag error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createTag = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug } = req.body;

    const tag = await Tag.create({
      name,
      slug
    });

    res.status(201).json({ 
      tag: {
        ...tag.toObject(),
        id: tag._id.toString()
      }
    });
  } catch (error: any) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const tag = await Tag.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ 
      tag: {
        ...tag.toObject(),
        id: tag._id.toString()
      }
    });
  } catch (error: any) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const result = await Tag.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error: any) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: error.message });
  }
};
