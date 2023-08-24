-- CreateTable
CREATE TABLE `MetricsStatistics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitTestId` INTEGER NOT NULL,
    `type` ENUM('uiFps', 'jsFps', 'usedCpu', 'usedRam') NOT NULL,
    `statistics` ENUM('avg', 'max', 'min') NOT NULL,
    `value` BIGINT UNSIGNED NOT NULL,
    `isDeleted` TINYINT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MetricsStatistics` ADD CONSTRAINT `MetricsStatistics_unitTestId_fkey` FOREIGN KEY (`unitTestId`) REFERENCES `UnitTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
