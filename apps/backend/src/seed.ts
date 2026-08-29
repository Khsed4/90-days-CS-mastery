import * as mysql from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🚀 Starting MySQL Database Seeder...');

  const dbUrl = process.env.DATABASE_URL || 'mysql://root:root@127.0.0.1:3306/challenges_90days';
  const pool = mysql.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    // 1. Ensure tables exist
    console.log('📦 Initializing tables if not created...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'USER',
        isEmailVerified TINYINT(1) NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        prerequisite MEDIUMTEXT NOT NULL,
        description MEDIUMTEXT NOT NULL,
        examples MEDIUMTEXT NOT NULL,
        constraints MEDIUMTEXT NOT NULL,
        java LONGTEXT NOT NULL,
        ts LONGTEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'CORE',
        status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
        authorId VARCHAR(36) NULL,
        authorName VARCHAR(255) NULL,
        rejectionReason TEXT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type_status (type, status),
        INDEX idx_author (authorId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL UNIQUE,
        completedDays MEDIUMTEXT NOT NULL,
        streak INT NOT NULL DEFAULT 0,
        interfaceLang VARCHAR(10) NOT NULL DEFAULT 'en',
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure columns exist on older tables
    const alterStatements = [
      "ALTER TABLE challenges MODIFY id INT AUTO_INCREMENT;",
      "ALTER TABLE challenges ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'CORE';",
      "ALTER TABLE challenges ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'APPROVED';",
      "ALTER TABLE challenges ADD COLUMN authorId VARCHAR(36) NULL;",
      "ALTER TABLE challenges ADD COLUMN authorName VARCHAR(255) NULL;",
      "ALTER TABLE challenges ADD COLUMN rejectionReason TEXT NULL;",
      "ALTER TABLE challenges ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;",
      "ALTER TABLE challenges ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;",
    ];

    for (const statement of alterStatements) {
      try {
        await pool.query(statement);
      } catch {
        // column may already exist
      }
    }

    // 2. Seed Admin User
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [existingUsers] = await pool.query<any[]>(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
      [adminEmail],
    );

    let adminId: string;
    if (existingUsers.length > 0) {
      adminId = existingUsers[0].id;
      await pool.query(
        'UPDATE users SET password = ?, name = ?, role = ?, isEmailVerified = 1 WHERE id = ?',
        [hashedPassword, 'Admin', 'ADMIN', adminId],
      );
      console.log(`✅ Admin user updated: email="${adminEmail}", password="${adminPassword}", role="ADMIN"`);
    } else {
      adminId = randomUUID();
      await pool.query(
        'INSERT INTO users (id, email, password, name, role, isEmailVerified) VALUES (?, ?, ?, ?, ?, ?)',
        [adminId, adminEmail, hashedPassword, 'Admin', 'ADMIN', 1],
      );
      await pool.query(
        'INSERT INTO progress (id, userId, completedDays, streak, interfaceLang) VALUES (?, ?, ?, ?, ?)',
        [randomUUID(), adminId, '[]', 0, 'en'],
      );
      console.log(`✅ Admin user created: email="${adminEmail}", password="${adminPassword}", role="ADMIN"`);
    }

    // 3. Seed 90 Challenges
    const challengesPath = path.join(__dirname, 'data', 'challenges.json');
    if (fs.existsSync(challengesPath)) {
      const rawData = fs.readFileSync(challengesPath, 'utf-8');
      const challenges = JSON.parse(rawData);

      console.log(`📦 Seeding ${challenges.length} challenges into MySQL...`);

      const upsertSql = `
        INSERT INTO challenges (id, title, difficulty, category, prerequisite, description, examples, constraints, java, ts, type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CORE', 'APPROVED')
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          difficulty = VALUES(difficulty),
          category = VALUES(category),
          prerequisite = VALUES(prerequisite),
          description = VALUES(description),
          examples = VALUES(examples),
          constraints = VALUES(constraints),
          java = VALUES(java),
          ts = VALUES(ts),
          type = 'CORE',
          status = 'APPROVED'
      `;

      for (const c of challenges) {
        await pool.query(upsertSql, [
          c.id,
          c.title,
          c.difficulty,
          c.category,
          c.prerequisite,
          c.description,
          c.examples,
          c.constraints,
          c.java,
          c.ts,
        ]);
      }

      console.log(`🎉 Successfully seeded all ${challenges.length} challenges into MySQL!`);
    } else {
      console.warn(`⚠️ challenges.json not found at ${challengesPath}`);
    }

    console.log('✨ Database seeding finished successfully.');
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
