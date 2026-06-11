import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Sortify",
    template: "%s | Sortify",
  },
  description:
    "Modern URL shortening platform with analytics and developer APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="min-h-full">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10rem] top-[-6rem] h-72 w-72 rounded-full bg-blue-300/30 blur-3xl sm:h-[26rem] sm:w-[26rem]" />
          <div className="absolute right-[-8rem] top-16 h-80 w-80 rounded-full bg-violet-300/28 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-200/22 blur-3xl sm:h-[22rem] sm:w-[22rem]" />
          <div className="absolute inset-x-0 bottom-[-12rem] mx-auto h-80 w-[36rem] rounded-full bg-sky-200/18 blur-3xl" />
        </div>
        <div className="relative flex min-h-full flex-col">{children}</div>
        <Toaster closeButton position="top-right" />
      </body>
    </html>
  );
}
