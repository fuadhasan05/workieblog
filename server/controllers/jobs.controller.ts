import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Job } from '../models/mongodb.js';
import mongoose from 'mongoose';

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

    const filter: any = { $and: [] };

    // For public API, only show active jobs
    if (status === 'ACTIVE') {
      filter.$and.push({ status: 'ACTIVE' });
      filter.$and.push({
        $or: [
          { expiresAt: null },
          { expiresAt: { $gte: new Date() } }
        ]
      });
    } else if (status !== 'all') {
      filter.$and.push({ status: status });
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$and.push({
        $or: [
          { title: searchRegex },
          { company: searchRegex },
          { location: searchRegex },
          { tags: { $in: [(search as string).toLowerCase()] } }
        ]
      });
    }

    if (jobType && jobType !== 'all') {
      filter.$and.push({ jobType: jobType });
    }

    if (remote === 'true') {
      filter.$and.push({ remote: true });
    }

    // Clean up empty $and array
    const finalFilter = filter.$and.length > 0 ? filter : {};

    const [jobs, total] = await Promise.all([
      Job.find(finalFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Job.countDocuments(finalFilter)
    ]);

    // Transform jobs to include id field
    const transformedJobs = jobs.map(job => ({
      ...job,
      id: job._id.toString()
    }));

    res.json({
      jobs: transformedJobs,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const job = await Job.findById(id).lean();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ 
      job: {
        ...job,
        id: job._id.toString()
      }
    });
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

    const job = await Job.create({
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
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });

    // Log the created job for debugging
    console.log('Job created:', job);

    res.status(201).json({ 
      job: {
        ...job.toObject(),
        id: job._id.toString()
      }
    });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = await Job.findByIdAndUpdate(
      id,
      {
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
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      },
      { new: true }
    );

    res.json({ 
      job: {
        ...job!.toObject(),
        id: job!._id.toString()
      }
    });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const existingJob = await Job.findById(id);

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await Job.findByIdAndDelete(id);

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
    const job = await Job.create({
      title,
      company,
      location,
      salary: salary || undefined,
      jobType: jobType || 'FULL_TIME',
      remote: remote || false,
      description,
      requirements: requirements || undefined,
      applicationUrl,
      tags: tags || [],
      status: 'INACTIVE' // Always starts inactive for review
    });

    res.status(201).json({ 
      job: {
        ...job.toObject(),
        id: job._id.toString()
      },
      message: 'Job submitted successfully. It will be reviewed by our team.'
    });
  } catch (error: any) {
    console.error('Submit job error:', error);
    res.status(500).json({ error: error.message });
  }
};
