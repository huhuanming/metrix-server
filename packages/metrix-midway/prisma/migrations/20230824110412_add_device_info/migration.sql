-- AlterTable
ALTER TABLE `Measure` ADD COLUMN `brand` VARCHAR(20) NULL,
    ADD COLUMN `buildNumber` VARCHAR(20) NULL,
    ADD COLUMN `commitHash` VARCHAR(40) NULL,
    ADD COLUMN `deviceId` VARCHAR(40) NULL,
    ADD COLUMN `fpTimeAt` DATETIME(3) NULL,
    ADD COLUMN `jsBundleLoadedTimeAt` DATETIME(3) NULL,
    ADD COLUMN `model` VARCHAR(40) NULL,
    ADD COLUMN `systemName` VARCHAR(20) NULL,
    ADD COLUMN `systemVersion` VARCHAR(20) NULL;
