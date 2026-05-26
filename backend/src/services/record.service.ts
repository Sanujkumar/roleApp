import { PrismaClient, Role } from '@prisma/client';
import { AuthPayload } from '../types';

const prisma = new PrismaClient();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class RecordService {
  async getRecords(user: AuthPayload) {
    await delay(2000 + Math.random() * 1000);

    if (user.role === Role.ADMIN) {
      return prisma.record.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return prisma.record.findMany({
      where: { userId: user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
