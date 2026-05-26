import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../types';

// Simple session-based auth using a shared store (in production use JWT or sessions properly)
const sessionStore = new Map<string, AuthPayload>();

export const createSession = (userId: string, payload: AuthPayload): void => {
  sessionStore.set(userId, payload);
};

export const getSession = (token: string): AuthPayload | undefined => {
  return sessionStore.get(token);
};

export const deleteSession = (token: string): void => {
  sessionStore.delete(token);
};

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const user = getSession(token);
  if (!user) {
    res.status(401).json({ success: false, error: 'Invalid or expired session' });
    return;
  }

  req.user = user;
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
};
