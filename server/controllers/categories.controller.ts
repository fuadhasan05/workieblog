import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Category, Post } from '../models/mongodb.js';
import mongoose from 'mongoose';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    // Get all categories
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Get post counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await Post.countDocuments({ categoryId: category._id });
        return {
          ...category,
          id: category._id.toString(),
          _count: {
            posts: postCount
          }
        };
      })
    );

    res.json({ categories: categoriesWithCount });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, color } = req.body;

    const category = await Category.create({
      name,
      slug,
      description,
      color
    });

    res.status(201).json({ 
      category: {
        ...category.toObject(),
        id: category._id.toString()
      }
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, color } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, color },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ 
      category: {
        ...category.toObject(),
        id: category._id.toString()
      }
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    // Check if category has posts
    const postsCount = await Post.countDocuments({ categoryId: new mongoose.Types.ObjectId(id) });

    if (postsCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with posts. Please reassign posts first.'
      });
    }

    const result = await Category.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: error.message });
  }
};
