-- AlterTable
ALTER TABLE `users` ADD COLUMN `selectedLanguage` VARCHAR(50) NULL DEFAULT 'typescript',
    ADD COLUMN `selectedCategories` TEXT NULL;

-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `allowedLanguages` TEXT NULL,
    ADD COLUMN `allowedCategories` TEXT NULL;

-- AlterTable
ALTER TABLE `challenges` ADD COLUMN `organizationId` VARCHAR(36) NULL,
    ADD COLUMN `solutions` LONGTEXT NULL;

-- CreateIndex
CREATE INDEX `challenges_organizationId_idx` ON `challenges`(`organizationId`);

-- AddForeignKey
ALTER TABLE `challenges` ADD CONSTRAINT `challenges_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
