-- AlterTable
ALTER TABLE "PrayerTime" ALTER COLUMN "prayerTimes" TYPE JSONB USING "prayerTimes"::jsonb;
