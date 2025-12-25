import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const trackEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, event, path, referrer } = req.body;

    const analytics = await prisma.analytics.create({
      data: {
        postId,
        event,
        path,
        referrer,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    res.status(201).json({ analytics });
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
    const totalViews = await prisma.analytics.count({
      where: {
        event: 'post_view',
        createdAt: { gte: startDate }
      }
    });

    // Get popular posts
    const popularPosts = await prisma.post.findMany({
      where: {
        publishedAt: { lte: new Date() },
        status: 'PUBLISHED'
      },
      orderBy: {
        views: 'desc'
      },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    // Get subscriber growth
    const subscriberGrowth = await prisma.subscriber.groupBy({
      by: ['subscribedAt'],
      _count: true,
      where: {
        subscribedAt: { gte: startDate }
      }
    });

    // Get subscriber stats by tier
    const subscribersByTier = await prisma.subscriber.groupBy({
      by: ['tier'],
      _count: true,
      where: {
        isActive: true
      }
    });

    // Get total subscribers
    const totalSubscribers = await prisma.subscriber.count({
      where: { isActive: true }
    });

    // Get posts published in period
    const postsPublished = await prisma.post.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: startDate }
      }
    });

    // Get views by day
    const viewsByDay = await prisma.$queryRaw<Array<{ date: Date; count: BigInt }>>`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM analytics
      WHERE event = 'post_view' AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    res.json({
      totalViews,
      popularPosts,
      subscriberGrowth,
      subscribersByTier,
      totalSubscribers,
      postsPublished,
      viewsByDay: viewsByDay.map(v => ({
        date: v.date,
        count: Number(v.count)
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

    // Get post views over time
    const viewsOverTime = await prisma.$queryRaw<Array<{ date: Date; count: BigInt }>>`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM analytics
      WHERE post_id = ${postId} AND event = 'post_view' AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Get referrers
    const topReferrers = await prisma.analytics.groupBy({
      by: ['referrer'],
      _count: true,
      where: {
        postId,
        event: 'post_view',
        createdAt: { gte: startDate },
        referrer: { not: null }
      },
      orderBy: {
        _count: {
          referrer: 'desc'
        }
      },
      take: 10
    });

    res.json({
      viewsOverTime: viewsOverTime.map(v => ({
        date: v.date,
        count: Number(v.count)
      })),
      topReferrers
    });
  } catch (error: any) {
    console.error('Get post analytics error:', error);
    res.status(500).json({ error: error.message });
  }
};
