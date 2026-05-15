import type { Metadata } from "next";

import "./globals.css";

import { QueryProvider } from "@/lib/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Frontend Ops Dashboard",
  description: "Frontend-focused SaaS dashboard project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <QueryProvider>{children}</QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
