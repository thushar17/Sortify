"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { normalizeUrl } from "@/lib/format";

export default function HeroShorten() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = normalizeUrl(url);
    if (!value) return;

    setPending(true);
    const target = `/dashboard?new=1&url=${encodeURIComponent(value)}`;
    const session = await getSession();
    router.push(session ? target : `/sign-in?callbackUrl=${encodeURIComponent(target)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
      <label htmlFor="hero-url" className="sr-only">
        Long URL
      </label>
      <input
        id="hero-url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Paste a long URL"
        autoComplete="off"
        className="h-11 min-w-0 rounded-md sm:flex-1 border border-input bg-card px-3.5 font-mono text-sm outline-none transition-colors placeholder:font-sans placeholder:text-muted-foreground focus:border-ring"
      />
      <Button type="submit" size="lg" className="h-11 px-5" disabled={pending || !url.trim()}>
        Shorten
        <ArrowRight />
      </Button>
    </form>
  );
}
