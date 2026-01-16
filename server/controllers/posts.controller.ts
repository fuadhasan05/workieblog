import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.js';
import { Post, User, Category, Tag } from '../models/mongodb.js';

// Helper to format post with relations
const formatPost = (post: any, author?: any, category?: any, tags?: any[]) => ({
  id: post._id.toString(),
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  featuredImage: post.featuredImage,
  status: post.status,
  publishedAt: post.publishedAt,
  scheduledFor: post.scheduledFor,
  readTime: post.readTime,
  isFeatured: post.isFeatured,
  isPremium: post.isPremium,
  accessLevel: post.accessLevel,
  views: post.views,
  authorId: post.authorId?.toString(),
  categoryId: post.categoryId?.toString(),
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  author: author ? {
    id: author._id.toString(),
    name: author.name,
    email: author.email,
    avatar: author.avatar,
    bio: author.bio
  } : undefined,
  category: category ? {
    id: category._id.toString(),
    slug: category.slug,
    name: category.name,
    color: category.color
  } : undefined,
  tags: tags ? tags.map((tag: any) => ({
    id: tag._id.toString(),
    slug: tag.slug,
    name: tag.name
  })) : []
});

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    console.log('=== GET POSTS REQUEST ===');
    console.log('Query params:', req.query);
    
    const {
      page = '1',
      limit = '10',
      status,
      category,
      authorId,
      search,
      startDate,
      endDate,
      tags,
      isFeatured
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (authorId) {
      filter.authorId = new mongoose.Types.ObjectId(authorId as string);
    }

    // Enhanced search: title, excerpt, and content
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { excerpt: { $regex: search as string, $options: 'i' } },
        { content: { $regex: search as string, $options: 'i' } }
      ];
    }

    // Date range filtering
    if (startDate || endDate) {
      filter.publishedAt = {};
      if (startDate) {
        filter.publishedAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.publishedAt.$lte = new Date(endDate as string);
      }
    }

    // Category filtering (by slug)
    if (category) {
      const cat = await Category.findOne({ slug: category as string });
      if (cat) {
        filter.categoryId = cat._id;
      }
    }

    // Tag filtering
    if (tags) {
      const tagArray = (tags as string).split(',');
      const tagDocs = await Tag.find({ slug: { $in: tagArray } });
      if (tagDocs.length > 0) {
        filter.tags = { $in: tagDocs.map(t => t._id) };
      }
    }

    console.log('MongoDB Filter:', JSON.stringify(filter, null, 2));

    // First check total count without filter
    const totalInDB = await Post.countDocuments({});
    console.log(`Total posts in database: ${totalInDB}`);

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Post.countDocuments(filter)
    ]);

    console.log(`Found ${posts.length} posts out of ${total} matching filter`);
    if (posts.length > 0) {
      console.log('Sample post:', JSON.stringify(posts[0], null, 2));
    }

    // Fetch related data
    const authorIds = [...new Set(posts.map(p => p.authorId).filter(Boolean))];
    const categoryIds = [...new Set(posts.map(p => p.categoryId).filter(Boolean))];
    const tagIds = [...new Set(posts.flatMap(p => p.tags || []))];

    console.log('Fetching relations - Authors:', authorIds.length, 'Categories:', categoryIds.length, 'Tags:', tagIds.length);

    const [authors, categories, allTags] = await Promise.all([
      authorIds.length > 0 ? User.find({ _id: { $in: authorIds } }).select('-password').lean() : [],
      categoryIds.length > 0 ? Category.find({ _id: { $in: categoryIds } }).lean() : [],
      tagIds.length > 0 ? Tag.find({ _id: { $in: tagIds } }).lean() : []
    ]);

    console.log('Fetched authors:', authors.length);
    console.log('Fetched categories:', categories.length);
    console.log('Fetched tags:', allTags.length);

    const authorMap = new Map(authors.map(a => [a._id.toString(), a]));
    const categoryMap = new Map(categories.map(c => [c._id.toString(), c]));
    const tagMap = new Map(allTags.map(t => [t._id.toString(), t]));

    const formattedPosts = posts.map(post => {
      const author = post.authorId ? authorMap.get(post.authorId.toString()) : null;
      const category = post.categoryId ? categoryMap.get(post.categoryId.toString()) : null;
      const postTags = (post.tags || []).map((tagId: any) => tagMap.get(tagId.toString())).filter(Boolean);
      return formatPost(post, author, category, postTags);
    });

    console.log('Returning formatted posts:', formattedPosts.length);

    res.json({
      posts: formattedPosts,
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
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const post = await Post.findOne(
      isObjectId ? { _id: id } : { slug: id }
    ).lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Fetch related data
    const [author, category, tags] = await Promise.all([
      post.authorId ? User.findById(post.authorId).select('-password').lean() : null,
      post.categoryId ? Category.findById(post.categoryId).lean() : null,
      post.tags?.length ? Tag.find({ _id: { $in: post.tags } }).lean() : []
    ]);

    res.json({ post: formatPost(post, author, category, tags) });
  } catch (error: any) {
    console.error('Get post error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    console.log('=== CREATE POST REQUEST ===');
    console.log('User:', req.user);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
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
      console.log('ERROR: Not authenticated');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });

    if (existingPost) {
      console.log('ERROR: Slug already exists:', slug);
      return res.status(400).json({ error: 'Slug already exists' });
    }

    // Create post data
    const postData: any = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      status: status || 'DRAFT',
      publishedAt: status === 'PUBLISHED' ? new Date() : publishedAt,
      scheduledFor,
      authorId: new mongoose.Types.ObjectId(req.user.userId),
      categoryId: categoryId ? new mongoose.Types.ObjectId(categoryId) : undefined,
      isFeatured: isFeatured || false,
      isPremium: isPremium || false,
      readTime,
      tags: tagIds ? tagIds.map((id: string) => new mongoose.Types.ObjectId(id)) : []
    };

    console.log('Post data to save:', JSON.stringify(postData, null, 2));

    // Create post
    const post = await Post.create(postData);
    
    console.log('Post created successfully:', post._id);

    // Fetch related data
    const [author, category, tags] = await Promise.all([
      User.findById(post.authorId).select('-password').lean(),
      post.categoryId ? Category.findById(post.categoryId).lean() : null,
      post.tags?.length ? Tag.find({ _id: { $in: post.tags } }).lean() : []
    ]);

    console.log('Post with relations fetched');

    res.status(201).json({ post: formatPost(post.toObject(), author, category, tags) });
  } catch (error: any) {
    console.error('=== CREATE POST ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
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
    const existingPost = await Post.findById(id);

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check permissions
    if (
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'EDITOR' &&
      existingPost.authorId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Check if new slug already exists
    if (slug && slug !== existingPost.slug) {
      const slugExists = await Post.findOne({ slug });

      if (slugExists) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Build update data
    const updateData: any = {
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
      isFeatured,
      isPremium,
      readTime
    };

    if (categoryId) {
      updateData.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    if (tagIds) {
      updateData.tags = tagIds.map((id: string) => new mongoose.Types.ObjectId(id));
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update post
    const post = await Post.findByIdAndUpdate(id, updateData, { new: true }).lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Fetch related data
    const [author, category, tags] = await Promise.all([
      post.authorId ? User.findById(post.authorId).select('-password').lean() : null,
      post.categoryId ? Category.findById(post.categoryId).lean() : null,
      post.tags?.length ? Tag.find({ _id: { $in: post.tags } }).lean() : []
    ]);

    res.json({ post: formatPost(post, author, category, tags) });
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
    const existingPost = await Post.findById(id);

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check permissions
    if (
      req.user.role !== 'ADMIN' &&
      existingPost.authorId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const incrementPostViews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).select('_id views');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post: { id: post._id.toString(), views: post.views } });
  } catch (error: any) {
    console.error('Increment views error:', error);
    res.status(500).json({ error: error.message });
  }
};
