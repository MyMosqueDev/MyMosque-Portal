import { router } from "../trpc";
import { mosqueRouter } from "./mosque";

export const appRouter = router({
  mosque: mosqueRouter,
});

export type AppRouter = typeof appRouter;
