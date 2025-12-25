import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';
import mongoose from 'mongoose';

// MongoDB Subscriber Schema (fallback)
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  tier: { type: String, default: 'FREE' },
  isActive: { type: Boolean, default: true },
  source: String,
  subscribedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongoSubscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export const getSubscribers = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      tier,
      isActive,
      search
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (tier) {
      where.tier = tier;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: {
          subscribedAt: 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.subscriber.count({ where })
    ]);

    res.json({
      subscribers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createSubscriber = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, tier, source } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
      // Try Prisma first
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { email }
      });

      if (existingSubscriber) {
        return res.status(400).json({ error: 'You are already subscribed!' });
      }

      const subscriber = await prisma.subscriber.create({
        data: {
          email,
          name,
          tier: tier || 'FREE',
          isActive: true,
          subscribedAt: new Date()
        }
      });

      res.status(201).json({ 
        subscriber,
        message: 'Successfully subscribed!' 
      });

    } catch (prismaError) {
      console.log('Prisma not available, using MongoDB fallback');
      
      // Fallback to MongoDB
      const existingSubscriber = await MongoSubscriber.findOne({ email });
      
      if (existingSubscriber) {
        return res.status(400).json({ error: 'You are already subscribed!' });
      }

      const subscriber = await MongoSubscriber.create({
        email,
        name,
        tier: tier || 'FREE',
        isActive: true,
        source: source || 'unknown',
        subscribedAt: new Date()
      });

      res.status(201).json({ 
        subscriber,
        message: 'Successfully subscribed!' 
      });
    }

  } catch (error: any) {
    console.error('Create subscriber error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You are already subscribed!' });
    }
    
    res.status(500).json({ 
      error: 'Failed to subscribe. Please try again later.',
      details: error.message 
    });
  }
};

export const updateSubscriber = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { tier, isActive, name } = req.body;

    const subscriber = await prisma.subscriber.update({
      where: { id },
      data: {
        tier,
        isActive,
        name,
        lastActiveAt: isActive ? new Date() : undefined
      }
    });

    res.json({ subscriber });
  } catch (error: any) {
    console.error('Update subscriber error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const exportSubscribers = async (req: AuthRequest, res: Response) => {
  try {
    const { tier, isActive } = req.query;

    const where: any = {};

    if (tier) {
      where.tier = tier;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const subscribers = await prisma.subscriber.findMany({
      where,
      orderBy: {
        subscribedAt: 'desc'
      }
    });

    // Convert to CSV
    const headers = ['Email', 'Name', 'Tier', 'Subscribed At', 'Last Active', 'Status'];
    const rows = subscribers.map(sub => [
      sub.email,
      sub.name || '',
      sub.tier,
      sub.subscribedAt.toISOString(),
      sub.lastActiveAt?.toISOString() || '',
      sub.isActive ? 'Active' : 'Inactive'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.send(csv);
  } catch (error: any) {
    console.error('Export subscribers error:', error);
    res.status(500).json({ error: error.message });
  }
};
