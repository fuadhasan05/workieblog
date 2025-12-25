import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all resources (public - only published)
export const getPublicResources = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where: any = { status: 'PUBLISHED' };
    if (category && category !== 'ALL') {
      where.category = category;
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { downloadCount: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        iconType: true,
        downloadCount: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
      },
    });

    res.json({ resources });
  } catch (error) {
    console.error('Error fetching public resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

// Get all resources (admin - all statuses)
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const { status, category, search, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      }),
      prisma.resource.count({ where }),
    ]);

    res.json({ resources, total });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

// Get single resource
export const getResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ resource });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
};

// Create resource (with file upload)
export const createResource = async (req: Request, res: Response) => {
  try {
    const { title, description, category, iconType, status } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    if (!title || !description) {
      // Clean up uploaded file if validation fails
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const fileUrl = `/uploads/${file.filename}`;

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category: category || 'CAREER_TOOLS',
        iconType: iconType || 'FILE_TEXT',
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        status: status || 'DRAFT',
      },
    });

    console.log('Resource created:', resource.id);
    res.status(201).json({ resource });
  } catch (error) {
    console.error('Error creating resource:', error);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    }
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

// Update resource
export const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, iconType, status } = req.body;
    const file = req.file;

    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      if (file) fs.unlinkSync(file.path);
      return res.status(404).json({ error: 'Resource not found' });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (iconType) updateData.iconType = iconType;
    if (status) updateData.status = status;

    // If new file uploaded, update file info and delete old file
    if (file) {
      updateData.fileUrl = `/uploads/${file.filename}`;
      updateData.fileName = file.originalname;
      updateData.fileSize = file.size;
      updateData.mimeType = file.mimetype;

      // Delete old file
      const oldFilePath = path.join(__dirname, '../..', existingResource.fileUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: updateData,
    });

    console.log('Resource updated:', resource.id);
    res.json({ resource });
  } catch (error) {
    console.error('Error updating resource:', error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    }
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

// Delete resource
export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Delete the file
    const filePath = path.join(__dirname, '../..', resource.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.resource.delete({
      where: { id },
    });

    console.log('Resource deleted:', id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};

// Download resource (increments count and serves file)
export const downloadResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.status !== 'PUBLISHED') {
      return res.status(403).json({ error: 'Resource not available' });
    }

    // Increment download count
    await prisma.resource.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    // Serve the file - handle both uploads and public folders
    const filePath = path.join(process.cwd(), resource.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', resource.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${resource.fileName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({ error: 'Failed to download resource' });
  }
};

// Get resource statistics
export const getResourceStats = async (req: Request, res: Response) => {
  try {
    const [totalResources, publishedResources, totalDownloads, byCategory] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.count({ where: { status: 'PUBLISHED' } }),
      prisma.resource.aggregate({
        _sum: { downloadCount: true },
      }),
      prisma.resource.groupBy({
        by: ['category'],
        _count: { id: true },
        _sum: { downloadCount: true },
      }),
    ]);

    res.json({
      totalResources,
      publishedResources,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
      byCategory,
    });
  } catch (error) {
    console.error('Error fetching resource stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
