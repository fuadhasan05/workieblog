import express from 'express';
import {
  registerMember,
  loginMember,
  logoutMember,
  getMemberProfile,
  updateMemberProfile
} from '../controllers/members.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerMember);
router.post('/login', loginMember);
router.post('/logout', logoutMember);
router.get('/me', authenticate, getMemberProfile);
router.put('/me', authenticate, updateMemberProfile);

export default router;
