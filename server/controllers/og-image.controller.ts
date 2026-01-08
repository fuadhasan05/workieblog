import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Post } from '../models/mongodb.js';

/**
 * Generate Open Graph image for a post
 *
 * This is a basic implementation that returns an SVG image with post details.
 * For production, consider using:
 * - @vercel/og for edge function OG images
 * - node-canvas for server-side canvas rendering
 * - Puppeteer for HTML to image conversion
 * - External services like Cloudinary or Imgix
 */
export const generateOGImage = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    // Fetch post details
    const post = await Post.findOne({ slug })
      .populate('authorId', 'name')
      .populate('categoryId', 'name color')
      .lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // If post has a featured image, redirect to it
    if (post.featuredImage && post.featuredImage.startsWith('http')) {
      return res.redirect(post.featuredImage);
    }

    // Generate SVG OG image
    const category = (post.categoryId as any);
    const author = (post.authorId as any);
    const categoryColor = category?.color || '#ec4899';
    const title = truncateText(post.title, 60);
    const authorName = author?.name || 'Unknown Author';
    const categoryName = category?.name || 'Article';

    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="1200" height="630" fill="#111827"/>

        <!-- Accent bar -->
        <rect width="1200" height="8" fill="${categoryColor}"/>

        <!-- Category badge -->
        <rect x="60" y="80" width="${categoryName.length * 12 + 40}" height="40" rx="20" fill="${categoryColor}"/>
        <text x="80" y="107" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">
          ${categoryName.toUpperCase()}
        </text>

        <!-- Title -->
        <text x="60" y="200" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="white">
          ${wrapText(title, 20).map((line, i) => `
            <tspan x="60" dy="${i === 0 ? 0 : 70}">${line}</tspan>
          `).join('')}
        </text>

        <!-- Author -->
        <text x="60" y="550" font-family="Arial, sans-serif" font-size="24" fill="#9CA3AF">
          by ${authorName}
        </text>

        <!-- Logo/Site name -->
        <text x="1140" y="580" text-anchor="end" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${categoryColor}">
          CareerBuddy
        </text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(svg);
  } catch (error: any) {
    console.error('Generate OG image error:', error);
    res.status(500).json({ error: error.message });
  }
};

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines for OG image
  return lines.slice(0, 3);
}
