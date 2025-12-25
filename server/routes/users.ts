import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/users.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN', 'EDITOR'), getUsers);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);

export default router;
