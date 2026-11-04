import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DAY = 24 * 60 * 60 * 1000;
const SPARKLINE_DAYS = 7;

export const getAuthenticatedDashboardContext = cache(async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return { session, user };
});

export const getUserLinkIndex = cache(async (userId: string) => {
  return prisma.link.findMany({
    where: {
      userId,
    },
    select: {
      slug: true,
      originalUrl: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 200,
  });
});

export const getUserLinksWithClicks = cache(async (userId: string) => {
  return prisma.link.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      slug: true,
      originalUrl: true,
      createdAt: true,
      expiresAt: true,
      password: true,
      clicks: {
        select: {
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

type LinksWithClicks = Awaited<ReturnType<typeof getUserLinksWithClicks>>;

function getDailyClicks(clicks: { createdAt: Date }[], days: number, now: Date) {
  const buckets = new Array<number>(days).fill(0);
  for (const click of clicks) {
    const age = Math.floor((now.getTime() - click.createdAt.getTime()) / DAY);
    if (age >= 0 && age < days) {
      buckets[days - 1 - age] += 1;
    }
  }
  return buckets;
}

export function formatDashboardLinks(links: LinksWithClicks, now = new Date()) {
  return links.map((link) => ({
    id: link.id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    totalClicks: link.clicks.length,
    dailyClicks: getDailyClicks(link.clicks, SPARKLINE_DAYS, now),
    hasPassword: Boolean(link.password),
    createdAt: link.createdAt,
    expiresAt: link.expiresAt,
  }));
}

export type DashboardLink = ReturnType<typeof formatDashboardLinks>[number];

export function getLinkMetrics(links: LinksWithClicks, now = new Date()) {
  let clicks30d = 0;
  let clicksPrev30d = 0;

  for (const link of links) {
    for (const click of link.clicks) {
      const age = now.getTime() - click.createdAt.getTime();
      if (age < 30 * DAY) clicks30d += 1;
      else if (age < 60 * DAY) clicksPrev30d += 1;
    }
  }

  return {
    totalLinks: links.length,
    clicks30d,
    clicksPrev30d,
    activeLinks: links.filter((link) => !link.expiresAt || link.expiresAt > now).length,
    protectedLinks: links.filter((link) => link.password).length,
    dailyClicks: getDailyClicks(
      links.flatMap((link) => link.clicks),
      30,
      now
    ),
  };
}
