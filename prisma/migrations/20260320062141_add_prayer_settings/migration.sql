/*
  Warnings:

  - Added the required column `prayerSettings` to the `Mosque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mosque" ADD COLUMN "prayerSettings" JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE "Mosque" ALTER COLUMN "prayerSettings" DROP DEFAULT;
