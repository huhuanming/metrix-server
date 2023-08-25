-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usename` VARCHAR(191) NOT NULL,
    `password` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `User_usename_key`(`usename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
