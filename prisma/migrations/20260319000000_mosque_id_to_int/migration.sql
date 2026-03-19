-- Truncate all data (dev only — will be re-seeded)
TRUNCATE "Mosque" CASCADE;

-- Drop foreign key constraints
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_mosqueId_fkey";
ALTER TABLE "Event" DROP CONSTRAINT "Event_mosqueId_fkey";
ALTER TABLE "PrayerTime" DROP CONSTRAINT "PrayerTime_mosqueId_fkey";

-- Change Mosque.id from TEXT to SERIAL
ALTER TABLE "Mosque" DROP CONSTRAINT "Mosque_pkey";
ALTER TABLE "Mosque" DROP COLUMN "id";
ALTER TABLE "Mosque" ADD COLUMN "id" SERIAL NOT NULL;
ALTER TABLE "Mosque" ADD CONSTRAINT "Mosque_pkey" PRIMARY KEY ("id");

-- Change mosqueId columns from TEXT to INTEGER
ALTER TABLE "Announcement" DROP COLUMN "mosqueId";
ALTER TABLE "Announcement" ADD COLUMN "mosqueId" INTEGER NOT NULL;

ALTER TABLE "Event" DROP COLUMN "mosqueId";
ALTER TABLE "Event" ADD COLUMN "mosqueId" INTEGER NOT NULL;

ALTER TABLE "PrayerTime" DROP COLUMN "mosqueId";
ALTER TABLE "PrayerTime" ADD COLUMN "mosqueId" INTEGER NOT NULL;

-- Re-add foreign key constraints
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PrayerTime" ADD CONSTRAINT "PrayerTime_mosqueId_fkey" FOREIGN KEY ("mosqueId") REFERENCES "Mosque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
