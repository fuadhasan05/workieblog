import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import cloudinary from '../utils/cloudinary.js';
import { Readable } from 'stream';

export const uploadToCloudinary = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Upload request received');
    console.log('User authenticated:', !!req.user);
    console.log('File present:', !!req.file);
    
    if (!req.user) {
      console.error('Authentication failed - no user');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Convert buffer to stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'workieblog/posts',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Upload failed', details: error.message });
        }

        if (!result) {
          console.error('Cloudinary upload - no result');
          return res.status(500).json({ error: 'Upload failed - no result' });
        }

        console.log('Upload successful:', result.secure_url);
        res.status(200).json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        });
      }
    );

    // Write file buffer to stream
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);

  } catch (error) {
    console.error('Upload to Cloudinary error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
