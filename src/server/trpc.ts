import { initTRPC, TRPCError } from "@trpc/server";
import { createServerClient } from "@supabase/ssr";
import { db } from "@/lib/db";

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

export async function createContext(req: Request): Promise<Context> {
  // ── Production: Supabase session ────────────────────────────────────────
  if (process.env.VERCEL_ENV === "production") {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const rawCookies = parseCookies(cookieHeader);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return Object.entries(rawCookies).map(([name, value]) => ({ name, value }));
          },
          setAll() {
            // read-only in tRPC context — session cookies are managed by middleware
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { mosqueId: null };

    const mosque = await db.mosque.findFirst({ where: { uid: user.id } });
    return { mosqueId: mosque?.id ?? null };
  }

  // ── Dev mode: cookie-based session ──────────────────────────────────────
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
