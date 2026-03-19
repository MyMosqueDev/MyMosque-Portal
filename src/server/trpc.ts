import { initTRPC, TRPCError } from "@trpc/server";

export type Context = {
  mosqueId: string | null;
};

function parseCookies(header: string): Record<string, string> {
  return Object.fromEntries(
    header
      .split(";")
      .map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k.trim(), decodeURIComponent(v.join("="))];
      })
      .filter(([k]) => k)
  );
}

export function createContext(req: Request): Context {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = parseCookies(cookieHeader);
  const raw = cookies["mosque-session"];
  if (raw) {
    try {
      const session = JSON.parse(
        Buffer.from(raw, "base64").toString("utf-8")
      );
      if (typeof session.mosqueId === "string") {
        return { mosqueId: session.mosqueId };
      }
    } catch {
      // ignore malformed cookie
    }
  }
  return { mosqueId: null };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.mosqueId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({ ctx: { mosqueId: ctx.mosqueId } });
});
