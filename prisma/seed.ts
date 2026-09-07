import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment from root .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Prisma Database Seeder...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin';

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: Role.ADMIN,
        isEmailVerified: true,
        progress: {
          create: {
            completedDays: '[]',
            streak: 0,
            interfaceLang: 'en',
          },
        },
      },
    });
    console.log(`✅ Created initial admin user: ${adminEmail}`);
  } else {
    // Admin exists; ensure role and email verification are intact without overriding password
    adminUser = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: Role.ADMIN,
        isEmailVerified: true,
      },
    });
    console.log(`ℹ️ Admin user already exists: ${adminEmail} (preserved credentials)`);
  }

  // Ensure progress record exists
  const existingProgress = await prisma.progress.findUnique({
    where: { userId: adminUser.id },
  });

  if (!existingProgress) {
    await prisma.progress.create({
      data: {
        userId: adminUser.id,
        completedDays: '[]',
        streak: 0,
        interfaceLang: 'en',
      },
    });
    console.log(`✅ Created progress tracker for admin: ${adminEmail}`);
  }

  console.log('✨ Prisma database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeder failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
