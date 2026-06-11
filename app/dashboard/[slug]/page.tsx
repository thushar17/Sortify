import { redirect } from "next/navigation";

import { AnalyticsTabs } from "@/components/AnalyticsTabs";
import { api } from "@/lib/api";
import { getAuthenticatedDashboardContext } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getAnalytics(slug: string) {
  const { data } = await api.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/${slug}`
  );
  return data;
}

export default async function AnalyticsPage({ params }: Props) {
  const { user } = await getAuthenticatedDashboardContext();
  const { slug } = await params;

  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link || link.userId !== user.id) {
    redirect("/dashboard");
  }

  const analytics = await getAnalytics(slug);

  return (
    <AnalyticsTabs
      slug={slug}
      originalUrl={link.originalUrl}
      analytics={analytics}
    />
  );
}
