/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = import.meta.env.DEV 
  ? (import.meta.env.VITE_USE_LOCAL_API === 'true' 
      ? 'http://localhost:3001'
      : 'https://workieblog-api.onrender.com')
  : (import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://workieblog-api.onrender.com');

/**
 * Converts a relative image URL to an absolute URL
 * Handles both local uploads and Cloudinary URLs
 */
export const getImageUrl = (url: string | null | undefined): string => {
  // Return empty string if no URL provided
  if (!url) {
    return '';
  }

  // If already an absolute URL (Cloudinary, etc.), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative path starting with /uploads, make it absolute
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }

  // If it's just a filename, assume it's in uploads
  if (!url.startsWith('/')) {
    return `${API_BASE_URL}/uploads/${url}`;
  }

  // Default: prepend API base URL
  return `${API_BASE_URL}${url}`;
};

/**
 * Gets a fallback image URL if the main image fails to load
 */
export const getFallbackImage = (): string => {
  return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop';
};
