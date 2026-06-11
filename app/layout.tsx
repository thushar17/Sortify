import type { Metadata } from "next";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sortify — URL Shortener",
    template: "%s | Sortify",
  },
  description:
    "Modern URL shortening platform with analytics, QR codes, and developer APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased relative">
        <div className="relative flex min-h-full flex-col">{children}</div>
        <Toaster closeButton position="top-right" />
      </body>
    </html>
  );
}
