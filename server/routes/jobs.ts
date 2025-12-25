import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  submitJob
} from '../controllers/jobs.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/submit', submitJob); // Public job submission

// Protected routes (Admin only)
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), createJob);
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), updateJob);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteJob);

export default router;
