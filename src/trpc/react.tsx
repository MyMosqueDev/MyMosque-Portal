"use client";

import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import type { AppRouter } from "@/server/routers";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1 * 60 * 1000,  // 5 min — no refetch on tab switch
            gcTime:    10 * 60 * 1000, // 10 min — keep inactive queries in memory
          },
        },
        queryCache: new QueryCache({
          onError(error, query) {
            // Only toast for background refetch failures (not initial load errors
            // which are handled inline with isError states)
            if (query.state.data !== undefined) {
              toast(error.message ?? "Something went wrong");
            }
          },
        }),
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "/api/trpc" })],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
