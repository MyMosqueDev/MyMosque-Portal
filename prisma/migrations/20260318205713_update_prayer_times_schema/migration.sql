/*
  Warnings:

  - You are about to drop the column `monthYear` on the `PrayerTime` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `PrayerTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incrementValues` to the `PrayerTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PrayerTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `PrayerTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeMode` to the `PrayerTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrayerTime" DROP COLUMN "monthYear",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "incrementValues" JSONB NOT NULL,
ADD COLUMN     "isNew" BOOLEAN,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'published',
ADD COLUMN     "timeMode" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
