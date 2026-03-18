import { router, publicProcedure } from "../trpc";
import { db } from "@/lib/db";

export const mosqueRouter = router({
  getAll: publicProcedure.query(async () => {
    return db.mosque.findMany();
  }),
});
