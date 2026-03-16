"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#141210",
              border: "1px solid #2a2416",
              color: "#f0e6c8",
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
