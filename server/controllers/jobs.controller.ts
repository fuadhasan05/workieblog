import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

// Public: Get all active jobs
export const getJobs = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      search,
      jobType,
      remote,
      status = 'ACTIVE'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // For public API, only show active jobs
    if (status === 'ACTIVE') {
      where.status = 'ACTIVE';
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } }
      ];
    } else if (status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { company: { contains: search as string, mode: 'insensitive' } },
            { location: { contains: search as string, mode: 'insensitive' } },
            { tags: { hasSome: [(search as string).toLowerCase()] } }
          ]
        }
      ];
    }

    if (jobType && jobType !== 'all') {
      where.jobType = jobType;
    }

    if (remote === 'true') {
      where.remote = true;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Public: Get single job
export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error: any) {
    console.error('Get job error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Create job
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      remote,
      description,
      requirements,
      applicationUrl,
      tags,
      status,
      expiresAt
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        salary,
        jobType: jobType || 'FULL_TIME',
        remote: remote || false,
        description,
        requirements,
        applicationUrl,
        tags: tags || [],
        status: status || 'ACTIVE',
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    res.status(201).json({ job });
  } catch (error: any) {
    console.error('Create job error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update job
export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      location,
      salary,
      jobType,
      remote,
      description,
      requirements,
      applicationUrl,
      tags,
      status,
      expiresAt
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        company,
        location,
        salary,
        jobType,
        remote,
        description,
        requirements,
        applicationUrl,
        tags,
        status,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    res.json({ job });
  } catch (error: any) {
    console.error('Update job error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete job
export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await prisma.job.delete({
      where: { id }
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Public: Submit job for review
export const submitJob = async (req: Request, res: Response) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      remote,
      description,
      requirements,
      applicationUrl,
      tags,
      contactEmail
    } = req.body;

    // Validate required fields
    if (!title || !company || !location || !description || !applicationUrl || !contactEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create job with INACTIVE status for admin review
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        salary: salary || null,
        jobType: jobType || 'FULL_TIME',
        remote: remote || false,
        description,
        requirements: requirements || null,
        applicationUrl,
        tags: tags || [],
        status: 'INACTIVE', // Always starts inactive for review
        expiresAt: null
      }
    });

    res.status(201).json({ 
      job,
      message: 'Job submitted successfully. It will be reviewed by our team.'
    });
  } catch (error: any) {
    console.error('Submit job error:', error);
    res.status(500).json({ error: error.message });
  }
};
