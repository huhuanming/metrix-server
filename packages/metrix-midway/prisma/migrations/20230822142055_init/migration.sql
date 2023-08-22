-- CreateTable
CREATE TABLE `UnitTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Measure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitTestId` INTEGER NOT NULL,
    `jsBundleLoadedTime` INTEGER NOT NULL,
    `fpTime` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Metrics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitTestId` INTEGER NOT NULL,
    `type` ENUM('uiFps', 'jsFps', 'usedCpu', 'usedRam') NOT NULL,
    `jsBundleLoadedTime` INTEGER NOT NULL,
    `fpTime` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Measure` ADD CONSTRAINT `Measure_unitTestId_fkey` FOREIGN KEY (`unitTestId`) REFERENCES `UnitTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Metrics` ADD CONSTRAINT `Metrics_unitTestId_fkey` FOREIGN KEY (`unitTestId`) REFERENCES `UnitTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
