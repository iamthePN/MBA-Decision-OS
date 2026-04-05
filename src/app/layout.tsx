import type { Metadata } from "next";

import { AppProviders } from "@/components/layout/app-providers";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`
  },
  description:
    "Outcome-first MBA decision intelligence platform for profile evaluation, admission probability, ROI simulation, and application tracking."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
