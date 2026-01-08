import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Analytics, Post, Subscriber } from '../models/mongodb.js';
import mongoose from 'mongoose';

export const trackEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, event, path, referrer } = req.body;

    const analyticsData: any = {
      event,
      path,
      referrer,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    };

    if (postId && mongoose.Types.ObjectId.isValid(postId)) {
      analyticsData.postId = new mongoose.Types.ObjectId(postId);
    }

    const analyticsDoc = await new Analytics(analyticsData).save();

    res.status(201).json({ 
      analytics: {
        ...analyticsDoc.toObject(),
        id: analyticsDoc._id.toString()
      }
    });
  } catch (error: any) {
    console.error('Track event error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total views
    const totalViews = await Analytics.countDocuments({
      event: 'post_view',
      createdAt: { $gte: startDate }
    });

    // Get popular posts
    const popularPosts = await Post.find({
      publishedAt: { $lte: new Date() },
      status: 'PUBLISHED'
    })
      .populate('categoryId', 'name slug')
      .sort({ views: -1 })
      .limit(10)
      .lean();

    const transformedPopularPosts = popularPosts.map((post: any) => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      views: post.views,
      publishedAt: post.publishedAt,
      category: post.categoryId ? {
        name: post.categoryId.name,
        slug: post.categoryId.slug
      } : null
    }));

    // Get subscriber growth using aggregation
    const subscriberGrowth = await Subscriber.aggregate([
      {
        $match: {
          subscribedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$subscribedAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get subscriber stats by tier
    const subscribersByTier = await Subscriber.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$tier',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total subscribers
    const totalSubscribers = await Subscriber.countDocuments({ isActive: true });

    // Get posts published in period
    const postsPublished = await Post.countDocuments({
      status: 'PUBLISHED',
      publishedAt: { $gte: startDate }
    });

    // Get views by day using aggregation
    const viewsByDay = await Analytics.aggregate([
      {
        $match: {
          event: 'post_view',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      totalViews,
      popularPosts: transformedPopularPosts,
      subscriberGrowth: subscriberGrowth.map(item => ({
        subscribedAt: item._id,
        _count: item.count
      })),
      subscribersByTier: subscribersByTier.map(item => ({
        tier: item._id,
        _count: item.count
      })),
      totalSubscribers,
      postsPublished,
      viewsByDay: viewsByDay.map(v => ({
        date: v._id,
        count: v.count
      }))
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPostAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Get post views over time using aggregation
    const viewsOverTime = await Analytics.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          event: 'post_view',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get referrers using aggregation
    const topReferrers = await Analytics.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          event: 'post_view',
          createdAt: { $gte: startDate },
          referrer: { $ne: null, $exists: true }
        }
      },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      viewsOverTime: viewsOverTime.map(v => ({
        date: v._id,
        count: v.count
      })),
      topReferrers: topReferrers.map(r => ({
        referrer: r._id,
        _count: r.count
      }))
    });
  } catch (error: any) {
    console.error('Get post analytics error:', error);
    res.status(500).json({ error: error.message });
  }
};
