"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
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
    </>
  );
}
