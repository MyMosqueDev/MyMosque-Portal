import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const prayerSettings = {
    schedule: {
      timeMode: {
        asr: "static",
        fajr: "increment",
        isha: "static",
        dhuhr: "static",
        maghrib: "increment"
      },
      prayerTimes: {
        asr: "18:15",
        fajr: "19:39",
        isha: "21:00",
        dhuhr: "14:00",
        maghrib: "20:40"
      },
      incrementValues: {
        asr: 0,
        fajr: 15,
        isha: 0,
        dhuhr: 0,
        maghrib: 5
      }
    },
    settings: {
      hanafiAsr: false,
      autoUpdate: true,
      adjustForDST: true,
      calculationMethod: "ISNA",
      sendNotifications: true
    }
  };

  await prisma.mosque.upsert({
    where: {
      id: 1,
    },
    update: { prayerSettings },
    create: {
      name: "Nueces Mosque",
      address: "1906 Nueces St, Austin, TX 78701",
      images: ["/nueces.jpg"],
      hours: {
        friday: "Fajr - 11:00 PM",
        monday: "24 hours",
        sunday: "Fajr - 11:00 pm",
        tuesday: "24 hours",
        saturday: "Fajr - 11:00 pm",
        thursday: "Fajr - 11:00 pm",
        wednesday: "Fajr - 11:00 pm"
      },
      lastAnnouncement: new Date(),
      lastEvent: new Date(),
      lastPrayerTime: new Date(),
      coordinates: {
        lat: 30.2672,
        lng: -97.7431,
      },
      jummahTimes: [
        {
          athanTime: "13:00",
          iqamaTime: "13:30",
        },
      ],
      prayerSettings,
      uid: "test-uid-1",
      email: "info@nuecesmosque.com",
      contactInfo: {
        phone: "817-751-6404",
        website: "https://www.nuecesmosque.com/",
      },
    },
  });

  await prisma.announcement.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      mosqueId: 1,
      title: "Welcome to Nueces Mosque",
      description: "We are excited to welcome you to our community. Please check our website for upcoming events and prayer times.",
      severity: "medium",
      status: "published",
      image: null,
    },
  });

  await prisma.event.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      mosqueId: 1,
      title: "Candid Convo - Defined By Revelation",
      description: "Join us for a Candid Convo Defined by Revelation as we explore masculinity and womanhood through the lens of the Qur'an and Sunnah.",
      date: new Date("2026-03-11T04:00:00Z"),
      host: "Ustadha Reem & Mufti Anwer",
      location: "Nueces Mosque",
      image: "https://ywxigrpuhgfbqwrmjovz.supabase.co/storage/v1/object/public/images/candid-convo---defined-by-revelation-2026-03-11.jpg",
      status: "published",
    },
  });

  await prisma.prayerTime.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      mosqueId: 1,
      mmYy: "03-26",
      prayerTimes: [
        { day: "01", times: { fajr: { adhan: "5:45 AM", iqama: "5:45 AM" }, dhuhr: { adhan: "12:20 PM", iqama: "12:20 PM" }, asr: { adhan: "3:53 PM", iqama: "3:53 PM" }, maghrib: { adhan: "5:30 PM", iqama: "5:30 PM" }, isha: { adhan: "6:50 PM", iqama: "6:50 PM" }, sunrise: "7:10 AM", sunset: "5:30 PM" } },
        { day: "02", times: { fajr: { adhan: "5:46 AM", iqama: "5:46 AM" }, dhuhr: { adhan: "12:21 PM", iqama: "12:21 PM" }, asr: { adhan: "3:53 PM", iqama: "3:53 PM" }, maghrib: { adhan: "5:30 PM", iqama: "5:30 PM" }, isha: { adhan: "6:50 PM", iqama: "6:50 PM" }, sunrise: "7:11 AM", sunset: "5:30 PM" } },
        { day: "03", times: { fajr: { adhan: "5:47 AM", iqama: "5:47 AM" }, dhuhr: { adhan: "12:21 PM", iqama: "12:21 PM" }, asr: { adhan: "3:53 PM", iqama: "3:53 PM" }, maghrib: { adhan: "5:30 PM", iqama: "5:30 PM" }, isha: { adhan: "6:50 PM", iqama: "6:50 PM" }, sunrise: "7:12 AM", sunset: "5:30 PM" } },
        { day: "04", times: { fajr: { adhan: "5:47 AM", iqama: "5:47 AM" }, dhuhr: { adhan: "12:21 PM", iqama: "12:21 PM" }, asr: { adhan: "3:53 PM", iqama: "3:53 PM" }, maghrib: { adhan: "5:30 PM", iqama: "5:30 PM" }, isha: { adhan: "6:50 PM", iqama: "6:50 PM" }, sunrise: "7:12 AM", sunset: "5:30 PM" } },
        { day: "05", times: { fajr: { adhan: "5:48 AM", iqama: "5:48 AM" }, dhuhr: { adhan: "12:22 PM", iqama: "12:22 PM" }, asr: { adhan: "3:53 PM", iqama: "3:53 PM" }, maghrib: { adhan: "5:30 PM", iqama: "5:30 PM" }, isha: { adhan: "6:51 PM", iqama: "6:51 PM" }, sunrise: "7:13 AM", sunset: "5:30 PM" } },
        { day: "06", times: { fajr: { adhan: "5:49 AM", iqama: "5:49 AM" }, dhuhr: { adhan: "12:22 PM", iqama: "12:22 PM" }, asr: { adhan: "3:54 PM", iqama: "3:54 PM" }, maghrib: { adhan: "5:30 PM", iqama: "5:30 PM" }, isha: { adhan: "6:51 PM", iqama: "6:51 PM" }, sunrise: "7:14 AM", sunset: "5:30 PM" } },
        { day: "07", times: { fajr: { adhan: "5:49 AM", iqama: "5:49 AM" }, dhuhr: { adhan: "12:23 PM", iqama: "12:23 PM" }, asr: { adhan: "3:54 PM", iqama: "3:54 PM" }, maghrib: { adhan: "5:30 PM", iqama: "5:30 PM" }, isha: { adhan: "6:51 PM", iqama: "6:51 PM" }, sunrise: "7:15 AM", sunset: "5:30 PM" } },
        { day: "08", times: { fajr: { adhan: "5:50 AM", iqama: "5:50 AM" }, dhuhr: { adhan: "12:23 PM", iqama: "12:23 PM" }, asr: { adhan: "3:54 PM", iqama: "3:54 PM" }, maghrib: { adhan: "5:31 PM", iqama: "5:31 PM" }, isha: { adhan: "6:51 PM", iqama: "6:51 PM" }, sunrise: "7:15 AM", sunset: "5:31 PM" } },
        { day: "09", times: { fajr: { adhan: "5:51 AM", iqama: "5:51 AM" }, dhuhr: { adhan: "12:24 PM", iqama: "12:24 PM" }, asr: { adhan: "3:54 PM", iqama: "3:54 PM" }, maghrib: { adhan: "5:31 PM", iqama: "5:31 PM" }, isha: { adhan: "6:51 PM", iqama: "6:51 PM" }, sunrise: "7:16 AM", sunset: "5:31 PM" } },
        { day: "10", times: { fajr: { adhan: "5:51 AM", iqama: "5:51 AM" }, dhuhr: { adhan: "12:24 PM", iqama: "12:24 PM" }, asr: { adhan: "3:54 PM", iqama: "3:54 PM" }, maghrib: { adhan: "5:31 PM", iqama: "5:31 PM" }, isha: { adhan: "6:52 PM", iqama: "6:52 PM" }, sunrise: "7:17 AM", sunset: "5:31 PM" } },
        { day: "11", times: { fajr: { adhan: "5:52 AM", iqama: "5:52 AM" }, dhuhr: { adhan: "12:24 PM", iqama: "12:24 PM" }, asr: { adhan: "3:54 PM", iqama: "3:54 PM" }, maghrib: { adhan: "5:31 PM", iqama: "5:31 PM" }, isha: { adhan: "6:52 PM", iqama: "6:52 PM" }, sunrise: "7:18 AM", sunset: "5:31 PM" } },
        { day: "12", times: { fajr: { adhan: "5:53 AM", iqama: "5:53 AM" }, dhuhr: { adhan: "12:25 PM", iqama: "12:25 PM" }, asr: { adhan: "3:55 PM", iqama: "3:55 PM" }, maghrib: { adhan: "5:32 PM", iqama: "5:32 PM" }, isha: { adhan: "6:52 PM", iqama: "6:52 PM" }, sunrise: "7:18 AM", sunset: "5:32 PM" } },
        { day: "13", times: { fajr: { adhan: "5:53 AM", iqama: "5:53 AM" }, dhuhr: { adhan: "12:25 PM", iqama: "12:25 PM" }, asr: { adhan: "3:55 PM", iqama: "3:55 PM" }, maghrib: { adhan: "5:32 PM", iqama: "5:32 PM" }, isha: { adhan: "6:53 PM", iqama: "6:53 PM" }, sunrise: "7:19 AM", sunset: "5:32 PM" } },
        { day: "14", times: { fajr: { adhan: "5:54 AM", iqama: "5:54 AM" }, dhuhr: { adhan: "12:26 PM", iqama: "12:26 PM" }, asr: { adhan: "3:55 PM", iqama: "3:55 PM" }, maghrib: { adhan: "5:32 PM", iqama: "5:32 PM" }, isha: { adhan: "6:53 PM", iqama: "6:53 PM" }, sunrise: "7:19 AM", sunset: "5:32 PM" } },
        { day: "15", times: { fajr: { adhan: "5:54 AM", iqama: "5:54 AM" }, dhuhr: { adhan: "12:26 PM", iqama: "12:26 PM" }, asr: { adhan: "3:56 PM", iqama: "3:56 PM" }, maghrib: { adhan: "5:32 PM", iqama: "5:32 PM" }, isha: { adhan: "6:53 PM", iqama: "6:53 PM" }, sunrise: "7:20 AM", sunset: "5:32 PM" } },
        { day: "16", times: { fajr: { adhan: "5:55 AM", iqama: "5:55 AM" }, dhuhr: { adhan: "12:27 PM", iqama: "12:27 PM" }, asr: { adhan: "3:56 PM", iqama: "3:56 PM" }, maghrib: { adhan: "5:33 PM", iqama: "5:33 PM" }, isha: { adhan: "6:54 PM", iqama: "6:54 PM" }, sunrise: "7:21 AM", sunset: "5:33 PM" } },
        { day: "17", times: { fajr: { adhan: "5:56 AM", iqama: "5:56 AM" }, dhuhr: { adhan: "12:27 PM", iqama: "12:27 PM" }, asr: { adhan: "3:56 PM", iqama: "3:56 PM" }, maghrib: { adhan: "5:33 PM", iqama: "5:33 PM" }, isha: { adhan: "6:54 PM", iqama: "6:54 PM" }, sunrise: "7:21 AM", sunset: "5:33 PM" } },
        { day: "18", times: { fajr: { adhan: "5:56 AM", iqama: "5:56 AM" }, dhuhr: { adhan: "12:28 PM", iqama: "12:28 PM" }, asr: { adhan: "3:57 PM", iqama: "3:57 PM" }, maghrib: { adhan: "5:34 PM", iqama: "5:34 PM" }, isha: { adhan: "6:55 PM", iqama: "6:55 PM" }, sunrise: "7:22 AM", sunset: "5:34 PM" } },
        { day: "19", times: { fajr: { adhan: "5:57 AM", iqama: "5:57 AM" }, dhuhr: { adhan: "12:28 PM", iqama: "12:28 PM" }, asr: { adhan: "3:57 PM", iqama: "3:57 PM" }, maghrib: { adhan: "5:34 PM", iqama: "5:34 PM" }, isha: { adhan: "6:55 PM", iqama: "6:55 PM" }, sunrise: "7:22 AM", sunset: "5:34 PM" } },
        { day: "20", times: { fajr: { adhan: "5:57 AM", iqama: "5:57 AM" }, dhuhr: { adhan: "12:29 PM", iqama: "12:29 PM" }, asr: { adhan: "3:58 PM", iqama: "3:58 PM" }, maghrib: { adhan: "5:35 PM", iqama: "5:35 PM" }, isha: { adhan: "6:56 PM", iqama: "6:56 PM" }, sunrise: "7:23 AM", sunset: "5:35 PM" } },
        { day: "21", times: { fajr: { adhan: "5:58 AM", iqama: "5:58 AM" }, dhuhr: { adhan: "12:29 PM", iqama: "12:29 PM" }, asr: { adhan: "3:58 PM", iqama: "3:58 PM" }, maghrib: { adhan: "5:35 PM", iqama: "5:35 PM" }, isha: { adhan: "6:56 PM", iqama: "6:56 PM" }, sunrise: "7:23 AM", sunset: "5:35 PM" } },
        { day: "22", times: { fajr: { adhan: "5:58 AM", iqama: "5:58 AM" }, dhuhr: { adhan: "12:30 PM", iqama: "12:30 PM" }, asr: { adhan: "3:59 PM", iqama: "3:59 PM" }, maghrib: { adhan: "5:36 PM", iqama: "5:36 PM" }, isha: { adhan: "6:57 PM", iqama: "6:57 PM" }, sunrise: "7:24 AM", sunset: "5:36 PM" } },
        { day: "23", times: { fajr: { adhan: "5:59 AM", iqama: "5:59 AM" }, dhuhr: { adhan: "12:30 PM", iqama: "12:30 PM" }, asr: { adhan: "3:59 PM", iqama: "3:59 PM" }, maghrib: { adhan: "5:36 PM", iqama: "5:36 PM" }, isha: { adhan: "6:57 PM", iqama: "6:57 PM" }, sunrise: "7:24 AM", sunset: "5:36 PM" } },
        { day: "24", times: { fajr: { adhan: "5:59 AM", iqama: "5:59 AM" }, dhuhr: { adhan: "12:31 PM", iqama: "12:31 PM" }, asr: { adhan: "4:00 PM", iqama: "4:00 PM" }, maghrib: { adhan: "5:37 PM", iqama: "5:37 PM" }, isha: { adhan: "6:58 PM", iqama: "6:58 PM" }, sunrise: "7:25 AM", sunset: "5:37 PM" } },
        { day: "25", times: { fajr: { adhan: "6:00 AM", iqama: "6:00 AM" }, dhuhr: { adhan: "12:31 PM", iqama: "12:31 PM" }, asr: { adhan: "4:00 PM", iqama: "4:00 PM" }, maghrib: { adhan: "5:37 PM", iqama: "5:37 PM" }, isha: { adhan: "6:58 PM", iqama: "6:58 PM" }, sunrise: "7:25 AM", sunset: "5:37 PM" } },
        { day: "26", times: { fajr: { adhan: "6:00 AM", iqama: "6:00 AM" }, dhuhr: { adhan: "12:32 PM", iqama: "12:32 PM" }, asr: { adhan: "4:01 PM", iqama: "4:01 PM" }, maghrib: { adhan: "5:38 PM", iqama: "5:38 PM" }, isha: { adhan: "6:59 PM", iqama: "6:59 PM" }, sunrise: "7:26 AM", sunset: "5:38 PM" } },
        { day: "27", times: { fajr: { adhan: "6:00 AM", iqama: "6:00 AM" }, dhuhr: { adhan: "12:32 PM", iqama: "12:32 PM" }, asr: { adhan: "4:01 PM", iqama: "4:01 PM" }, maghrib: { adhan: "5:39 PM", iqama: "5:39 PM" }, isha: { adhan: "6:59 PM", iqama: "6:59 PM" }, sunrise: "7:26 AM", sunset: "5:39 PM" } },
        { day: "28", times: { fajr: { adhan: "6:01 AM", iqama: "6:01 AM" }, dhuhr: { adhan: "12:33 PM", iqama: "12:33 PM" }, asr: { adhan: "4:02 PM", iqama: "4:02 PM" }, maghrib: { adhan: "5:39 PM", iqama: "5:39 PM" }, isha: { adhan: "7:00 PM", iqama: "7:00 PM" }, sunrise: "7:26 AM", sunset: "5:39 PM" } },
        { day: "29", times: { fajr: { adhan: "6:01 AM", iqama: "6:01 AM" }, dhuhr: { adhan: "12:33 PM", iqama: "12:33 PM" }, asr: { adhan: "4:03 PM", iqama: "4:03 PM" }, maghrib: { adhan: "5:40 PM", iqama: "5:40 PM" }, isha: { adhan: "7:01 PM", iqama: "7:01 PM" }, sunrise: "7:27 AM", sunset: "5:40 PM" } },
        { day: "30", times: { fajr: { adhan: "6:01 AM", iqama: "6:01 AM" }, dhuhr: { adhan: "12:34 PM", iqama: "12:34 PM" }, asr: { adhan: "4:03 PM", iqama: "4:03 PM" }, maghrib: { adhan: "5:40 PM", iqama: "5:40 PM" }, isha: { adhan: "7:01 PM", iqama: "7:01 PM" }, sunrise: "7:27 AM", sunset: "5:40 PM" } },
        { day: "31", times: { fajr: { adhan: "6:02 AM", iqama: "6:02 AM" }, dhuhr: { adhan: "12:34 PM", iqama: "12:34 PM" }, asr: { adhan: "4:04 PM", iqama: "4:04 PM" }, maghrib: { adhan: "5:41 PM", iqama: "5:41 PM" }, isha: { adhan: "7:02 PM", iqama: "7:02 PM" }, sunrise: "7:27 AM", sunset: "5:41 PM" } },
      ],
    },
  });

  console.log("Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());