import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment from root .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Prisma Database Seeder...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin';

  // 1. Seed or update default Admin user
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
    // Admin exists; ensure role and email verification are intact
    adminUser = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: Role.ADMIN,
        isEmailVerified: true,
      },
    });
    console.log(`ℹ️ Admin user already exists: ${adminEmail} (preserved credentials)`);
  }

  // 2. Ensure admin progress record exists
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

  // 3. Seed 90 Challenges from data.json
  const possiblePaths = [
    path.resolve(__dirname, 'data.json'),
    path.resolve(__dirname, '..', 'data.json'),
  ];

  let dataFilePath = possiblePaths.find((p) => fs.existsSync(p));

  if (dataFilePath) {
    console.log(`📖 Loading challenge dataset from: ${dataFilePath}`);
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    const challenges = JSON.parse(rawData);

    console.log(`📦 Upserting ${challenges.length} challenges into database...`);

    for (const c of challenges) {
      await prisma.challenge.upsert({
        where: { id: c.id },
        update: {
          title: c.title,
          difficulty: c.difficulty,
          category: c.category,
          prerequisite: c.prerequisite,
          description: c.description,
          examples: c.examples,
          constraints: c.constraints,
          java: c.java,
          ts: c.ts,
          type: c.type || 'CORE',
          status: c.status || 'APPROVED',
        },
        create: {
          id: c.id,
          title: c.title,
          difficulty: c.difficulty,
          category: c.category,
          prerequisite: c.prerequisite,
          description: c.description,
          examples: c.examples,
          constraints: c.constraints,
          java: c.java,
          ts: c.ts,
          type: c.type || 'CORE',
          status: c.status || 'APPROVED',
        },
      });
    }

    console.log(`🎉 Successfully seeded all ${challenges.length} questions into MySQL!`);
  } else {
    console.warn(`⚠️ Warning: data.json not found in ${possiblePaths.join(' or ')}`);
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
