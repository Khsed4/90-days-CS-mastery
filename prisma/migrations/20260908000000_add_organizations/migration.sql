-- AlterTable
ALTER TABLE `users` ADD COLUMN `organizationId` VARCHAR(191) NULL,
    MODIFY `role` ENUM('USER', 'ORGANIZATION', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `organizations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `organizations_slug_key`(`slug`),
    UNIQUE INDEX `organizations_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `organization_invites` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `email` VARCHAR(255) NULL,
    `maxUses` INTEGER NOT NULL DEFAULT 0,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `organization_invites_token_key`(`token`),
    INDEX `organization_invites_token_idx`(`token`),
    INDEX `organization_invites_organizationId_idx`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateIndex
CREATE INDEX `users_organizationId_idx` ON `users`(`organizationId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_invites` ADD CONSTRAINT `organization_invites_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
