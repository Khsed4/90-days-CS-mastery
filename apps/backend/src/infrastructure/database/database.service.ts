import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: mysql.Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const dbUrl = this.configService.get<string>(
      'DATABASE_URL',
      'mysql://root:root@127.0.0.1:3306/challenges_90days',
    );

    try {
      this.pool = mysql.createPool({
        uri: dbUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      const conn = await this.pool.getConnection();
      this.logger.log('✅ Successfully connected to MySQL database pool');
      conn.release();

      await this.initializeTables();
    } catch (error) {
      this.logger.error('❌ Failed to initialize MySQL connection:', error);
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('MySQL connection pool closed');
    }
  }

  getPool(): mysql.Pool {
    return this.pool;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T> {
    const [results] = await this.pool.execute(sql, params);
    return results as T;
  }

  private async initializeTables() {
    this.logger.log('Checking and initializing MySQL database tables...');

    const createUsers = `
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
    `;

    const createEmailVerifications = `
      CREATE TABLE IF NOT EXISTS email_verifications (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createChallenges = `
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
    `;

    const createProgress = `
      CREATE TABLE IF NOT EXISTS progress (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL UNIQUE,
        completedDays MEDIUMTEXT NOT NULL,
        streak INT NOT NULL DEFAULT 0,
        interfaceLang VARCHAR(10) NOT NULL DEFAULT 'en',
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await this.query(createUsers);
    await this.query(createEmailVerifications);
    await this.query(createChallenges);
    await this.query(createProgress);

    // Apply incremental migrations if columns missing
    try {
      await this.query(`
        ALTER TABLE challenges 
        MODIFY id INT AUTO_INCREMENT;
      `);
      await this.query(`
        ALTER TABLE challenges 
        ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'CORE',
        ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
        ADD COLUMN authorId VARCHAR(36) NULL,
        ADD COLUMN authorName VARCHAR(255) NULL,
        ADD COLUMN rejectionReason TEXT NULL,
        ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
      `);
    } catch {
      // Ignore if columns already present
    }

    this.logger.log('✅ MySQL tables verified and ready (users, email_verifications, challenges, progress)');
  }
}
