import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.mosque.upsert({
    where: {
      id: "seed-mosque-1",
    },
    update: {},
    create: {
      id: "seed-mosque-1",
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
          id: "1",
          name: "First Jummah",
          athan: "13:00",
          iqama: "13:30"
        },
      ],
      uid: "test-uid-1",
      email: "info@nuecesmosque.com",
      contactInfo: {
        phone: "817-751-6404",
        website: "https://www.nuecesmosque.com/",
      },
    },
  });

  await prisma.announcement.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      mosqueId: "seed-mosque-1",
      title: "Welcome to Nueces Mosque",
      description: "We are excited to welcome you to our community. Please check our website for upcoming events and prayer times.",
      severity: "medium",
      status: "published",
      image: null,
    },
  });

  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      mosqueId: "seed-mosque-1",
      title: "Candid Convo - Defined By Revelation",
      description: "Join us for a Candid Convo Defined by Revelation as we explore masculinity and womanhood through the lens of the Qur'an and Sunnah.",
      date: new Date("2026-03-11T04:00:00Z"),
      host: "Ustadha Reem & Mufti Anwer",
      location: "Nueces Mosque",
      image: "/events/candid-convo-defined-by-revelation.jpg",
      status: "published",
    },
  });

  await prisma.prayerTime.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      mosqueId: "seed-mosque-1",
      monthYear: "03-26",
      prayerTimes: [
        { day: "01", times: { fajr: { adhan: "5:45 AM", iqama: "6:00 AM" }, sunrise: "7:10 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:30 PM", iqama: "4:45 PM" }, maghrib: { adhan: "7:35 PM", iqama: "7:35 PM" }, isha: { adhan: "9:00 PM", iqama: "9:15 PM" }, sunset: "7:35 PM" } },
        { day: "02", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "03", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "04", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "05", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "06", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "07", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "08", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "09", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "10", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "11", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "12", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "13", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "14", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "15", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "16", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "17", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "18", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "19", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "20", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "21", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "22", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "23", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "24", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "25", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "26", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "27", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "28", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "29", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "30", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
        { day: "31", times: { fajr: { adhan: "5:44 AM", iqama: "6:00 AM" }, sunrise: "7:08 AM", dhuhr: { adhan: "1:20 PM", iqama: "1:30 PM" }, asr: { adhan: "4:31 PM", iqama: "4:46 PM" }, maghrib: { adhan: "7:36 PM", iqama: "7:36 PM" }, isha: { adhan: "9:01 PM", iqama: "9:16 PM" }, sunset: "7:36 PM" } },
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