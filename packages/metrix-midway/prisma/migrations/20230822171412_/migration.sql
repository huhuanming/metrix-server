/*
  Warnings:

  - A unique constraint covering the columns `[unitTestId]` on the table `Measure` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Measure_unitTestId_key` ON `Measure`(`unitTestId`);
