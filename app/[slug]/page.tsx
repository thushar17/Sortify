import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import StatusPage from "@/components/marketing/status-page";
import { getBrowser, getDevice } from "@/lib/analytics";
import { formatDateTime, getShortHost } from "@/lib/format";
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
        <StatusPage code="503" title="Something went wrong">
          We couldn&apos;t open this link right now. Try again in a moment.
        </StatusPage>
      );
    }
  }
  // Link not found
  if (!link) {
    notFound();
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
      <StatusPage code="410" title="This link has expired">
        <span className="font-mono text-foreground">
          {getShortHost()}/{slug}
        </span>{" "}
        stopped working on {formatDateTime(link.expiresAt)}. If you need it, ask the person who shared it for
        a new one.
      </StatusPage>
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
