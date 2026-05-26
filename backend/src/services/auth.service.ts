import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { AuthPayload, LoginRequest } from '../types';
import { createSession } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class AuthService {
  async login(data: LoginRequest): Promise<{ token: string; user: AuthPayload }> {
    // Artificial delay 2-3 seconds
    await delay(2000 + Math.random() * 1000);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const payload: AuthPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = randomBytes(32).toString('hex');
    createSession(token, payload);

    return { token, user: payload };
  }
}
