import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { deleteSession } from '../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
      }

      const result = await authService.login({ email, password });

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({ success: false, error: message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        deleteSession(token);
      }
      res.json({ success: true, message: 'Logged out successfully' });
    } catch {
      res.status(500).json({ success: false, error: 'Logout failed' });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    res.json({ success: true, data: req.user });
  }
}
