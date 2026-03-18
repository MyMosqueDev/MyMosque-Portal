import { createCallerFactory } from "@/server/trpc";
import { appRouter } from "@/server/routers";

const createCaller = createCallerFactory(appRouter);

// Server-side caller — use this in Server Components / Route Handlers
export const serverCaller = createCaller({});
