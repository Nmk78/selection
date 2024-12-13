import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@prisma/client/edge';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'], // Optional: helpful for debugging
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
