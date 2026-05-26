import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { Role } from '@prisma/client';

const userService = new UserService();

export class UserController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      res.status(500).json({ success: false, error: message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ success: false, error: 'Name, email, and password are required' });
        return;
      }

      if (role && !Object.values(Role).includes(role)) {
        res.status(400).json({ success: false, error: 'Invalid role. Must be USER or ADMIN' });
        return;
      }

      const user = await userService.createUser({ name, email, password, role });
      res.status(201).json({ success: true, data: user, message: 'User created successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      res.status(400).json({ success: false, error: message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, error: 'Invalid user ID' });
        return;
      }

      const { name, email, role } = req.body;

      if (role && !Object.values(Role).includes(role)) {
        res.status(400).json({ success: false, error: 'Invalid role. Must be USER or ADMIN' });
        return;
      }

      const user = await userService.updateUser(id, { name, email, role });
      res.json({ success: true, data: user, message: 'User updated successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      res.status(400).json({ success: false, error: message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, error: 'Invalid user ID' });
        return;
      }

      // Prevent deleting yourself
      if (req.user?.id === id) {
        res.status(400).json({ success: false, error: 'You cannot delete your own account' });
        return;
      }

      const result = await userService.deleteUser(id);
      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      res.status(400).json({ success: false, error: message });
    }
  }
}
