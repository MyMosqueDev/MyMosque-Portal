import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server/routers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function friendlyError(err: TRPCClientErrorLike<AppRouter> | any): string {
  const code: string | undefined = err?.data?.code ?? err?.code;

  switch (code) {
    case "UNAUTHORIZED":        return "Session expired — please sign in again";
    case "FORBIDDEN":           return "You don't have permission";
    case "NOT_FOUND":           return "Not found";
    case "CONFLICT":            return "Already exists";
    case "TOO_MANY_REQUESTS":   return "Too many requests, slow down";
    case "INTERNAL_SERVER_ERROR": return "Server error — try again";
    case "BAD_REQUEST": {
      // Validation messages are usually meaningful — show them if concise
      const msg: string = err?.message ?? "";
      return msg.length <= 80 ? msg : "Invalid input";
    }
    default: {
      const msg: string = err?.message ?? "";
      return msg.length <= 80 ? msg : "Something went wrong";
    }
  }
}
