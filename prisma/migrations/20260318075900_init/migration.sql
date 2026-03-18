-- CreateTable
CREATE TABLE "Mosque" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "images" TEXT[],
    "hours" JSONB NOT NULL,
    "lastAnnouncement" TIMESTAMP(3) NOT NULL,
    "lastEvent" TIMESTAMP(3) NOT NULL,
    "lastPrayerTime" TIMESTAMP(3) NOT NULL,
    "coordinates" JSONB NOT NULL,
    "jummahTimes" JSONB NOT NULL,
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactInfo" JSONB NOT NULL,

    CONSTRAINT "Mosque_pkey" PRIMARY KEY ("id")
);
