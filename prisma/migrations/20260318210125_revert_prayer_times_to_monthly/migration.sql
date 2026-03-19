/*
  Warnings:

  - You are about to drop the column `endDate` on the `PrayerTime` table. All the data in the column will be lost.
  - You are about to drop the column `incrementValues` on the `PrayerTime` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `PrayerTime` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PrayerTime` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PrayerTime` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PrayerTime` table. All the data in the column will be lost.
  - You are about to drop the column `timeMode` on the `PrayerTime` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PrayerTime` table. All the data in the column will be lost.
  - Added the required column `mmYy` to the `PrayerTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrayerTime" DROP COLUMN "endDate",
DROP COLUMN "incrementValues",
DROP COLUMN "isNew",
DROP COLUMN "name",
DROP COLUMN "startDate",
DROP COLUMN "status",
DROP COLUMN "timeMode",
DROP COLUMN "updatedAt",
ADD COLUMN     "mmYy" TEXT NOT NULL;
