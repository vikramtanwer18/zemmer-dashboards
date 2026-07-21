"use client";

import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { makeStore, type AppStore } from "./index";
import { registerSessionExpiredHandler } from "@/lib/api/client";
import { sessionExpired, bootstrapAuth } from "./slices/auth.slice";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(bootstrapAuth());
  }

  const router = useRouter();

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      storeRef.current?.dispatch(sessionExpired());
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (!path.startsWith("/login") && !path.startsWith("/register")) {
          router.replace("/login");
        }
      }
    });
  }, [router]);

  return (
    <Provider store={storeRef.current}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ duration: 4000 }}
      />
    </Provider>
  );
}
