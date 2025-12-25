import express from 'express';
import { generateOGImage } from '../controllers/og-image.controller.js';

const router = express.Router();

// Generate OG image for a post
router.get('/post/:slug', generateOGImage);

export default router;
