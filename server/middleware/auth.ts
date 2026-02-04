import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check for both admin and member tokens
    const token = req.cookies.token || req.cookies.member_token || req.headers.authorization?.replace('Bearer ', '');
    console.log('[AUTH] Incoming request:', req.method, req.originalUrl, '| Token:', token ? 'present' : 'missing');

    if (!token) {
      console.log('[AUTH] No token provided');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    console.log('[AUTH] Token valid for user:', decoded?.email || decoded?.id || decoded);
    next();
  } catch (error) {
    console.log('[AUTH] Invalid or expired token:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Optional authentication - doesn't fail if no token
export const authenticateOptional = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.cookies.member_token || req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // Silently fail, just continue without user
    next();
  }
};

export const authorize = (...roles: (string | string[])[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log('[AUTHZ] No user found in request');
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Flatten the roles array in case an array was passed
    const flatRoles = roles.flat();

    if (!flatRoles.includes(req.user.role)) {
      console.log('[AUTHZ] User role', req.user.role, 'not in allowed roles', flatRoles);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    console.log('[AUTHZ] User authorized with role', req.user.role);
    next();
  };
};

// Alias for authenticate function (for backward compatibility)
export const authenticateToken = authenticate;

// Role-based authorization middleware
export const requireRole = (...roles: (string | string[])[]) => {
  return authorize(...roles);
};
