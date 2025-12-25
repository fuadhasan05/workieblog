import { Router } from 'express';
import { 
  getPublicResources, 
  getAllResources, 
  getResource, 
  createResource, 
  updateResource, 
  deleteResource,
  downloadResource,
  getResourceStats
} from '../controllers/resources.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { uploadResource } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/public', getPublicResources);
router.get('/download/:id', downloadResource);

// Admin routes (require authentication)
router.get('/', authenticateToken, requireRole(['ADMIN', 'EDITOR']), getAllResources);
router.get('/stats', authenticateToken, requireRole(['ADMIN', 'EDITOR']), getResourceStats);
router.get('/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), getResource);
router.post('/', authenticateToken, requireRole(['ADMIN', 'EDITOR']), uploadResource.single('file'), createResource);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'EDITOR']), uploadResource.single('file'), updateResource);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteResource);

export default router;
