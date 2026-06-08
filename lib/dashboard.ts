import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getAuthenticatedDashboardContext = cache(async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

  return { session, user };
});

export const getUserLinksWithClicks = cache(async (userId: string) => {
  return prisma.link.findMany({
    where: {
      userId,
    },
    include: {
      clicks: true,
    },
  });
});

export function formatDashboardLinks(
  links: Awaited<ReturnType<typeof getUserLinksWithClicks>>
) {
  return links.map((link) => ({
    id: link.id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    totalClicks: link.clicks.length,
    createdAt: link.createdAt,
  }));
}

export function getLinkMetrics(
  links: ReturnType<typeof formatDashboardLinks>
) {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0);
  const activeLinks = links.filter((link) => link.totalClicks > 0).length;

  return {
    totalLinks,
    totalClicks,
    activeLinks,
  };
}
