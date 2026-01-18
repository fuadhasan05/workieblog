import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Media } from '../models/mongodb.js';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadMedia = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the full URL for the uploaded file
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      uploadedBy: new mongoose.Types.ObjectId(req.user.userId)
    });

    // Populate user info
    const populatedMedia = await Media.findById(media._id)
      .populate('uploadedBy', 'name email')
      .lean();

    res.status(201).json({ 
      media: {
        ...populatedMedia,
        id: populatedMedia!._id.toString(),
        user: populatedMedia!.uploadedBy
      }
    });
  } catch (error: any) {
    console.error('Upload media error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMediaList = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      type
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (type) {
      if (type === 'image') {
        filter.mimeType = { $regex: /^image\// };
      } else if (type === 'video') {
        filter.mimeType = { $regex: /^video\// };
      }
    }

    const [media, total] = await Promise.all([
      Media.find(filter)
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Media.countDocuments(filter)
    ]);

    // Transform media to include id and user fields
    const transformedMedia = media.map((item: any) => ({
      ...item,
      id: item._id.toString(),
      user: item.uploadedBy ? {
        id: item.uploadedBy._id.toString(),
        name: item.uploadedBy.name,
        email: item.uploadedBy.email
      } : null
    }));

    res.json({
      media: transformedMedia,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get media error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Check permissions
    if (
      req.user.role !== 'ADMIN' &&
      media.uploadedBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', media.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Delete from database
    await Media.findByIdAndDelete(id);

    res.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: error.message });
  }
};
