import { router, authedProcedure, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import { z } from "zod";
import { generateMonthPrayerTimes, fetchAladhanCalendar } from "@/lib/prayer-times";

const SeveritySchema = z.enum(["low", "medium", "high"]);

export const mosqueRouter = router({
  // ── Mosque ────────────────────────────────────────────────────────────────

  getMe: authedProcedure.query(async ({ ctx }) => {
    return db.mosque.findUnique({ where: { id: ctx.mosqueId } });
  }),

  updateJummah: authedProcedure
    .input(
      z.array(
        z.object({ athanTime: z.string(), iqamaTime: z.string() })
      )
    )
    .mutation(async ({ ctx, input }) => {
      return db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { jummahTimes: input },
      });
    }),

  // ── Announcements ─────────────────────────────────────────────────────────

  listAnnouncements: authedProcedure.query(async ({ ctx }) => {
    return db.announcement.findMany({
      where: { mosqueId: ctx.mosqueId, status: { not: "deleted" } },
      orderBy: { createdAt: "desc" },
    });
  }),

  createAnnouncement: authedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        severity: SeveritySchema,
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("ctx.mosqueId", input);
      const result = await db.announcement.create({
        data: { mosqueId: ctx.mosqueId, ...input, status: "published" },
      });
      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastAnnouncement: new Date() },
      });
      return result;
    }),

  updateAnnouncement: authedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().min(1),
        severity: SeveritySchema,
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await db.announcement.update({
        where: { id, mosqueId: ctx.mosqueId },
        data,
      });
      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastAnnouncement: new Date() },
      });
      return result;
    }),

  deleteAnnouncement: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.announcement.update({
        where: { id: input.id, mosqueId: ctx.mosqueId },
        data: { status: "deleted" },
      });
      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastAnnouncement: new Date() },
      });
      return result;
    }),

  // ── Events ────────────────────────────────────────────────────────────────

  listEvents: authedProcedure.query(async ({ ctx }) => {
    return db.event.findMany({
      where: { mosqueId: ctx.mosqueId, status: { not: "deleted" } },
      orderBy: { date: "asc" },
    });
  }),

  getEvent: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return db.event.findFirst({
      where: { id: input.id },
    });
  }),

  createEvent: authedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.string(),
        host: z.string(),
        location: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db.event.create({
        data: {
          mosqueId: ctx.mosqueId,
          title: input.title,
          description: input.description,
          date: new Date(input.date),
          host: input.host,
          location: input.location,
          image: input.image,
          status: "published",
        },
      });
      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastEvent: new Date() },
      });
      return result;
    }),

  updateEvent: authedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.string(),
        host: z.string(),
        location: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, date, ...rest } = input;
      const result = await db.event.update({
        where: { id, mosqueId: ctx.mosqueId },
        data: { ...rest, date: new Date(date) },
      });
      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastEvent: new Date() },
      });
      return result;
    }),

  deleteEvent: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.event.update({
        where: { id: input.id, mosqueId: ctx.mosqueId },
        data: { status: "deleted" },
      });
      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastEvent: new Date() },
      });
      return result;
    }),

  getAdhanCalendar: authedProcedure
    .input(z.object({ monthYear: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const mosque = await db.mosque.findUnique({ where: { id: ctx.mosqueId } });
      if (!mosque) throw new Error("Mosque not found");

      const ref = input.monthYear
        ? (() => {
            const [mm, yy] = input.monthYear.split("-").map(Number);
            return { month: mm, year: 2000 + yy };
          })()
        : { month: new Date().getMonth() + 1, year: new Date().getFullYear() };

      const ps = (mosque.prayerSettings as any)?.settings ?? {};

      return fetchAladhanCalendar(
        mosque.address,
        ref.year,
        ref.month,
        ps.calculationMethod ?? "ISNA",
        ps.hanafiAsr ?? false
      );
    }),

  updatePrayerSettings: authedProcedure
    .input(
      z.object({
        schedule: z.object({
          timeMode: z.record(z.string(), z.enum(["static", "increment"])),
          prayerTimes: z.record(z.string(), z.string()),
          incrementValues: z.record(z.string(), z.number()),
        }),
        settings: z.object({
          hanafiAsr: z.boolean(),
          calculationMethod: z.string(),
          autoUpdate: z.boolean().optional(),
          adjustForDST: z.boolean().optional(),
          sendNotifications: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { prayerSettings: input as any },
      });
    }),

  generatePrayerTimes: authedProcedure
    .input(z.object({ monthYear: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const mosque = await db.mosque.findUnique({ where: { id: ctx.mosqueId } });
      if (!mosque) throw new Error("Mosque not found");
      const prayerTimes = await generateMonthPrayerTimes(mosque, input.monthYear);

      const mmYy = input.monthYear ?? (() => {
        const d = new Date();
        return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getFullYear()).slice(2)}`;
      })();

      const existing = await db.prayerTime.findFirst({
        where: { mosqueId: ctx.mosqueId, mmYy },
      });

      let result;
      if (existing) {
        result = await db.prayerTime.update({
          where: { id: existing.id },
          data: { prayerTimes: prayerTimes as any },
        });
      } else {
        result = await db.prayerTime.create({
          data: { mosqueId: ctx.mosqueId, mmYy, prayerTimes: prayerTimes as any },
        });
      }

      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastPrayerTime: new Date() },
      });

      return result;
    }),

  // ── Prayer Times ──────────────────────────────────────────────────────────

  getPrayerTimes: authedProcedure
    .input(z.object({ monthYear: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.prayerTime.findFirst({
        where: { mosqueId: ctx.mosqueId, mmYy: input.monthYear },
      });
    }),

  savePrayerTimes: authedProcedure
    .input(
      z.object({
        monthYear: z.string(),
        prayerTimes: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await db.prayerTime.findFirst({
        where: { mosqueId: ctx.mosqueId, mmYy: input.monthYear },
      });
      let result;
      if (existing) {
        result = await db.prayerTime.update({
          where: { id: existing.id },
          data: { prayerTimes: input.prayerTimes },
        });
      } else {
        result = await db.prayerTime.create({
          data: {
            mosqueId: ctx.mosqueId,
            mmYy: input.monthYear,
            prayerTimes: input.prayerTimes,
          },
        });
      }
      await db.mosque.update({
        where: { id: ctx.mosqueId },
        data: { lastPrayerTime: new Date() },
      });
      return result;
    }),
});
