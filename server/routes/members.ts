import express from 'express';
import {
  registerMember,
  loginMember,
  logoutMember,
  getMemberProfile,
  updateMemberProfile,
  adminListMembers,
  adminUpdateMember,
  adminDeleteMember
} from '../controllers/members.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerMember);
router.post('/login', loginMember);
router.post('/logout', logoutMember);
router.get('/me', authenticate, getMemberProfile);
router.put('/me', authenticate, updateMemberProfile);

// Admin routes for member management
router.get('/admin/list', authenticate, requireRole('ADMIN', 'EDITOR'), adminListMembers);
router.put('/admin/:id', authenticate, requireRole('ADMIN', 'EDITOR'), adminUpdateMember);
router.delete('/admin/:id', authenticate, requireRole('ADMIN'), adminDeleteMember);

export default router;
