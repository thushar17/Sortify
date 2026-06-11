"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute left-6 top-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-[#475569] transition-colors hover:text-[#020617]"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xl font-semibold text-white shadow-[0_14px_30px_rgba(59,130,246,0.22)]">
            S
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-[#0f172a]">
              Welcome back to Sortify
            </h1>
            <p className="mt-1.5 text-sm text-[#475569]">
              No account needed — sign in with Google to get started.
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <button
            id="google-signin-button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-[0.875rem] border border-[rgba(255,255,255,0.78)] bg-[rgba(255,255,255,0.76)] py-3 text-sm font-medium text-[#0f172a] shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:bg-[rgba(255,255,255,0.92)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-[#3b82f6]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[rgba(148,163,184,0.18)]" />
            <p className="text-xs text-[#64748b]">Secure OAuth 2.0</p>
            <div className="h-px flex-1 bg-[rgba(148,163,184,0.18)]" />
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-[#64748b]">
            By signing in, you agree to our{" "}
            <span className="text-[#0f172a]">Terms of Service</span> and{" "}
            <span className="text-[#0f172a]">Privacy Policy</span>.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#64748b]">
          Sortify · Built for developers ·{" "}
          <Link href="/docs" className="text-[#475569] hover:text-[#0f172a]">
            API docs
          </Link>
        </p>
      </div>
    </div>
  );
}
