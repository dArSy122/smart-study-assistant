-- AlterTable
ALTER TABLE `study_topics` ADD COLUMN `folderId` INTEGER NULL;

-- CreateTable
CREATE TABLE `topic_folders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `topic_folders_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `study_topics_folderId_idx` ON `study_topics`(`folderId`);

-- AddForeignKey
ALTER TABLE `study_topics` ADD CONSTRAINT `study_topics_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `topic_folders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topic_folders` ADD CONSTRAINT `topic_folders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
