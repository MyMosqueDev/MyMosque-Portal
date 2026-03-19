import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { createContext } from "@/server/trpc";
import { logger } from "@/lib/logger";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req }) => createContext(req),
    onError({ path, error, type, ctx }) {
      logger.error("trpc", `${type} ${path ?? "unknown"} → ${error.code}: ${error.message}`, {
        path,
        type,
        code: error.code,
        message: error.message,
        mosqueId: ctx?.mosqueId ?? null,
        ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
      });
    },
  });

export { handler as GET, handler as POST };
