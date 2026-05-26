import { PrismaClient, Role, RecordStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.record.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });


  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
      role: Role.USER,
    },
  });


  await prisma.record.createMany({
    data: [
      { title: 'System Configuration Audit', status: RecordStatus.COMPLETED, userId: admin.id },
      { title: 'User Access Review', status: RecordStatus.ACTIVE, userId: admin.id },
      { title: 'Security Policy Update', status: RecordStatus.PENDING, userId: admin.id },
    ],
  });

  await prisma.record.createMany({
    data: [
      { title: 'Q4 Sales Report', status: RecordStatus.COMPLETED, userId: user1.id },
      { title: 'Client Onboarding - Acme Corp', status: RecordStatus.ACTIVE, userId: user1.id },
      { title: 'Market Analysis Draft', status: RecordStatus.PENDING, userId: user1.id },
      { title: 'Budget Forecast 2024', status: RecordStatus.ARCHIVED, userId: user1.id },
    ],
  });


  await prisma.record.createMany({
    data: [
      { title: 'Infrastructure Migration Plan', status: RecordStatus.ACTIVE, userId: user2.id },
      { title: 'API Documentation', status: RecordStatus.COMPLETED, userId: user2.id },
      { title: 'Performance Optimization Report', status: RecordStatus.PENDING, userId: user2.id },
    ],
  });

  console.log('Seeding complete!');
  console.log('');
  console.log('Test credentials:');
  console.log('  Admin: admin@example.com / password123');
  console.log('  User:  alice@example.com / password123');
  console.log('  User:  bob@example.com   / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
