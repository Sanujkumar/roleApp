import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserRequest, UpdateUserRequest } from '../types';

const prisma = new PrismaClient();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class UserService {
  async getAllUsers() {
    await delay(2000 + Math.random() * 1000);

    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { records: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(data: CreateUserRequest) {
    await delay(2000 + Math.random() * 1000);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserRequest) {
    await delay(2000 + Math.random() * 1000);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) throw new Error('Email already in use');
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.role && { role: data.role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: number) {
    await delay(2000 + Math.random() * 1000);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
