import express from 'express';
import { getAuthors, getAuthorBySlug } from '../controllers/authors.controller.js';

const router = express.Router();

router.get('/', getAuthors);
router.get('/:slug', getAuthorBySlug);

export default router;
