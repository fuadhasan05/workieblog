import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.js';
import { Member } from '../models/mongodb.js';
import { connectToMongoDB } from '../utils/mongodb.js';
import { generateToken } from '../utils/jwt.js';

export const registerMember = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Ensure MongoDB is connected
    await connectToMongoDB();

    // Check if member already exists
    const existingMember = await Member.findOne({ email: email.toLowerCase() });

    if (existingMember) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create member
    const member = await Member.create({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      membershipTier: 'FREE',
      emailVerified: false
    });

    // Generate token
    const token = generateToken({
      userId: member._id.toString(),
      email: member.email,
      role: 'MEMBER'
    });

    // Set cookie
    res.cookie('member_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const memberResponse = {
      id: member._id.toString(),
      email: member.email,
      name: member.name,
      membershipTier: member.membershipTier,
      membershipStatus: member.membershipStatus,
      emailVerified: member.emailVerified,
      avatar: member.avatar,
      createdAt: member.createdAt
    };

    res.status(201).json({ member: memberResponse, token });
  } catch (error: any) {
    console.error('Register member error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const loginMember = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Ensure MongoDB is connected
    await connectToMongoDB();

    // Find member
    const member = await Member.findOne({ email: email.toLowerCase() });

    if (!member) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, member.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      userId: member._id.toString(),
      email: member.email,
      role: 'MEMBER'
    });

    // Set cookie
    res.cookie('member_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const memberResponse = {
      id: member._id.toString(),
      email: member.email,
      name: member.name,
      avatar: member.avatar,
      membershipTier: member.membershipTier,
      membershipStatus: member.membershipStatus,
      subscriptionStartDate: member.subscriptionStartDate,
      subscriptionEndDate: member.subscriptionEndDate,
      emailVerified: member.emailVerified,
      createdAt: member.createdAt
    };

    res.json({ member: memberResponse, token });
  } catch (error: any) {
    console.error('Login member error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const logoutMember = async (req: AuthRequest, res: Response) => {
  res.clearCookie('member_token');
  res.json({ message: 'Logged out successfully' });
};

export const getMemberProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Ensure MongoDB is connected
    await connectToMongoDB();

    const member = await Member.findById(req.user.userId).select('-password');

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const memberResponse = {
      id: member._id.toString(),
      email: member.email,
      name: member.name,
      avatar: member.avatar,
      membershipTier: member.membershipTier,
      membershipStatus: member.membershipStatus,
      subscriptionStartDate: member.subscriptionStartDate,
      subscriptionEndDate: member.subscriptionEndDate,
      emailVerified: member.emailVerified,
      createdAt: member.createdAt
    };

    res.json({ member: memberResponse });
  } catch (error: any) {
    console.error('Get member profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateMemberProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, avatar } = req.body;

    // Ensure MongoDB is connected
    await connectToMongoDB();

    const member = await Member.findByIdAndUpdate(
      req.user.userId,
      { name, avatar },
      { new: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const memberResponse = {
      id: member._id.toString(),
      email: member.email,
      name: member.name,
      avatar: member.avatar,
      membershipTier: member.membershipTier,
      membershipStatus: member.membershipStatus,
      createdAt: member.createdAt
    };

    res.json({ member: memberResponse });
  } catch (error: any) {
    console.error('Update member profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: List all members with filtering and pagination
export const adminListMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '20', search, tier, status } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Ensure MongoDB is connected
    await connectToMongoDB();

    // Build filter query
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tier && tier !== 'all') {
      filter.membershipTier = tier;
    }
    
    if (status === 'active') {
      filter.isActive = { $ne: false };
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const [members, total] = await Promise.all([
      Member.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Member.countDocuments(filter)
    ]);

    res.json({
      members: members.map(m => ({
        _id: m._id.toString(),
        email: m.email,
        name: m.name,
        avatar: m.avatar,
        membershipTier: m.membershipTier,
        membershipStatus: m.membershipStatus,
        emailVerified: m.emailVerified,
        isActive: m.isActive !== false,
        createdAt: m.createdAt,
        lastLoginAt: (m as any).lastLoginAt,
        firebaseUid: (m as any).firebaseUid
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Admin list members error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update a member
export const adminUpdateMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, membershipTier, membershipStatus, isActive } = req.body;

    // Ensure MongoDB is connected
    await connectToMongoDB();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (membershipTier !== undefined) updateData.membershipTier = membershipTier;
    if (membershipStatus !== undefined) updateData.membershipStatus = membershipStatus;
    if (isActive !== undefined) updateData.isActive = isActive;

    const member = await Member.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({
      success: true,
      member: {
        _id: member._id.toString(),
        email: member.email,
        name: member.name,
        avatar: member.avatar,
        membershipTier: member.membershipTier,
        membershipStatus: member.membershipStatus,
        emailVerified: member.emailVerified,
        isActive: member.isActive !== false,
        createdAt: member.createdAt
      }
    });
  } catch (error: any) {
    console.error('Admin update member error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete a member
export const adminDeleteMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Ensure MongoDB is connected
    await connectToMongoDB();

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error: any) {
    console.error('Admin delete member error:', error);
    res.status(500).json({ error: error.message });
  }
};

