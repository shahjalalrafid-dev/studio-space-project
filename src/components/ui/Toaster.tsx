"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide notification surface (Sonner).
 * Every success/error message in StudioSpace flows through here —
 * native `alert()` / `confirm()` are never used.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      offset={100}
      duration={4500}
      closeButton
      richColors
      toastOptions={{
        style: {
          borderRadius: "16px",
          paddingLeft: "16px",
          border: "1px solid rgba(11, 11, 15, 0.08)",
          boxShadow: "0 24px 48px -28px rgba(11, 11, 15, 0.55)",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          fontSize: "14.5px",
        },
      }}
    />
  );
}
