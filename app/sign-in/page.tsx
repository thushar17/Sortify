import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { Logo } from "@/components/app/logo";
import SignInCard from "@/components/marketing/sign-in-card";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-24">
        <div className="w-full max-w-[360px]">
          <h1 className="text-xl font-semibold tracking-tight">Sign in to Sortify</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Use your Google account. New here? Signing in creates your account.
          </p>
          <div className="mt-6">
            <Suspense>
              <SignInCard />
            </Suspense>
          </div>
          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            We only read your name, email, and profile picture from Google. Looking for the API?{" "}
            <Link href="/docs" className="text-foreground underline underline-offset-4">
              Read the docs
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
