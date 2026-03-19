import { router, authedProcedure, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import { z } from "zod";

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
      return db.announcement.create({
        data: { mosqueId: ctx.mosqueId, ...input, status: "published" },
      });
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
      return db.announcement.update({
        where: { id, mosqueId: ctx.mosqueId },
        data,
      });
    }),

  deleteAnnouncement: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return db.announcement.update({
        where: { id: input.id, mosqueId: ctx.mosqueId },
        data: { status: "deleted" },
      });
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
      return db.event.create({
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
      return db.event.update({
        where: { id, mosqueId: ctx.mosqueId },
        data: { ...rest, date: new Date(date) },
      });
    }),

  deleteEvent: authedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return db.event.update({
        where: { id: input.id, mosqueId: ctx.mosqueId },
        data: { status: "deleted" },
      });
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
      if (existing) {
        return db.prayerTime.update({
          where: { id: existing.id },
          data: { prayerTimes: input.prayerTimes },
        });
      }
      return db.prayerTime.create({
        data: {
          mosqueId: ctx.mosqueId,
          mmYy: input.monthYear,
          prayerTimes: input.prayerTimes,
        },
      });
    }),
});
