import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBrowser, getDevice } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import type { Link as PrismaLink } from "@prisma/client";
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PageRedirect({ params }: Props) {
  const { slug } = await params;

  let link: PrismaLink | null = null;

  // Try Redis cache first, fall back to DB on any error
  try {
    const cachedLink = await redis.get(slug);
    if (cachedLink) {
      link =
        typeof cachedLink === "string"
          ? (JSON.parse(cachedLink) as PrismaLink)
          : (cachedLink as PrismaLink);
    }
  } catch (error) {
    console.error("[redis] cache lookup failed:", error);
  }

  // If not in cache, query DB
  if (!link) {
    try {
      link = await prisma.link.findUnique({ where: { slug } });

      if (link) {
        // Best-effort cache write — don't crash if Redis is down
        try {
          await redis.set(slug, JSON.stringify(link), { ex: 60 * 60 });
        } catch (error) {
          console.error("[redis] cache write failed:", error);
        }
      }
    } catch (error) {
      console.error("[prisma] DB lookup failed:", error);
      // DB is unavailable — show a friendly error instead of crashing
      return (
        <main className="page-shell min-h-screen items-center justify-center">
          <section className="glass-card section-shell w-full max-w-xl text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">
                Something went wrong
              </h1>
              <p className="text-[#475569]">
                We couldn&apos;t process this link right now. Please try again in a moment.
              </p>
              <Link href="/" className="secondary-button">
                Return Home
              </Link>
            </div>
          </section>
        </main>
      );
    }
  }
  // Link not found
  if (!link) {
    return (
      <main className="page-shell min-h-screen items-center justify-center">
        <section className="glass-card section-shell w-full max-w-xl text-center">
          <div className="relative flex flex-col items-center gap-5">
            <div className="flex size-16 items-center justify-center rounded-[1.5rem] border border-[rgba(239,68,68,0.16)] bg-[rgba(239,68,68,0.08)] text-rose-600">
              <AlertCircle className="size-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">
                Link not found
              </h1>

              <p className="text-sm leading-7 text-[#475569]">
                The short link{" "}
                <span className="font-mono font-semibold text-[#4f46e5]">/{slug}</span>{" "}
                does not exist.
              </p>
            </div>

            <Link
              href="/"
              className="secondary-button"
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const cookieStore = await cookies()

  const verified = cookieStore.get(`verified-${slug}`)
  if(link.password && !verified){
     redirect(`/verify/${slug}`);
  }
  // Expired link
  if (
    link.expiresAt &&
    link.expiresAt < new Date()
  ) {
    return (
      <main className="page-shell min-h-screen items-center justify-center">
        <section className="glass-card section-shell w-full max-w-xl text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">
              Link Expired
            </h1>

            <p className="text-[#475569]">
              This short link has expired and is
              no longer available.
            </p>

            <Link
              href="/"
              className="secondary-button"
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const headersList = await headers();

  const userAgent =
    headersList.get("user-agent") || "";

  const browser = getBrowser(userAgent);
  const device = getDevice(userAgent);

  const forwardedFor =
    headersList.get("x-forwarded-for");

  const ip =
    forwardedFor?.split(",")[0] || "";

  let country = "Unknown";

  if (ip) {
    try {
      const res = await fetch(`https://ip-api.com/json/${ip}`);
      const data = await res.json();
      country = data.country || "Unknown";
    } catch (error) {
      console.error("[ip-api] failed to resolve country:", error);
    }
  }

  try {
    await prisma.click.create({
      data: {
        browser,
        device,
        country,
        linkId: link.id,
      },
    });
  } catch (error) {
    console.error("[analytics] failed to record click:", error);
  }

  redirect(link.originalUrl);
}
