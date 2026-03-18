/*
  Warnings:

  - The `severity` column on the `Announcement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Announcement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `image` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('published', 'draft', 'deleted');

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "severity",
ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'medium',
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'published';

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "image" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'published';
