import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Subscriber } from '../models/mongodb.js';
import mongoose from 'mongoose';

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

    const filter: any = {};

    if (tier) {
      filter.tier = tier;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { email: searchRegex },
        { name: searchRegex }
      ];
    }

    const [subscribers, total] = await Promise.all([
      Subscriber.find(filter)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Subscriber.countDocuments(filter)
    ]);

    // Transform subscribers to include id field
    const transformedSubscribers = subscribers.map(sub => ({
      ...sub,
      id: sub._id.toString()
    }));

    res.json({
      subscribers: transformedSubscribers,
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

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      return res.status(400).json({ error: 'You are already subscribed!' });
    }

    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      name,
      tier: tier || 'FREE',
      isActive: true,
      subscribedAt: new Date()
    });

    res.status(201).json({ 
      subscriber: {
        ...subscriber.toObject(),
        id: subscriber._id.toString()
      },
      message: 'Successfully subscribed!' 
    });

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid subscriber ID' });
    }

    const updateData: any = {};
    if (tier !== undefined) updateData.tier = tier;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (name !== undefined) updateData.name = name;
    if (isActive) updateData.lastActiveAt = new Date();

    const subscriber = await Subscriber.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({ 
      subscriber: {
        ...subscriber.toObject(),
        id: subscriber._id.toString()
      }
    });
  } catch (error: any) {
    console.error('Update subscriber error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const exportSubscribers = async (req: AuthRequest, res: Response) => {
  try {
    const { tier, isActive } = req.query;

    const filter: any = {};

    if (tier) {
      filter.tier = tier;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const subscribers = await Subscriber.find(filter)
      .sort({ subscribedAt: -1 })
      .lean();

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
