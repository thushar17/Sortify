import { Suspense } from "react";

import LinkTable from "@/components/app/link-table";
import NewLinkDialog from "@/components/app/new-link-dialog";
import PageHeader from "@/components/app/page-header";
import StatStrip from "@/components/app/stat-strip";
import {
  formatDashboardLinks,
  getAuthenticatedDashboardContext,
  getLinkMetrics,
  getUserLinksWithClicks,
} from "@/lib/dashboard";
import { formatCompact, formatNumber } from "@/lib/format";

function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export default async function DashboardPage() {
  const { user } = await getAuthenticatedDashboardContext();
  const rawLinks = await getUserLinksWithClicks(user.id);
  const links = formatDashboardLinks(rawLinks);
  const metrics = getLinkMetrics(rawLinks);

  const stats = [
    {
      label: "Links",
      value: formatNumber(metrics.totalLinks),
      hint: `${formatNumber(metrics.activeLinks)} active`,
    },
    {
      label: "Clicks, last 30 days",
      value: formatCompact(metrics.clicks30d),
      change: percentChange(metrics.clicks30d, metrics.clicksPrev30d),
      hint: metrics.clicksPrev30d > 0 ? "vs previous 30 days" : "No earlier data",
      trend: metrics.dailyClicks,
    },
    {
      label: "Active",
      value: formatNumber(metrics.activeLinks),
      hint: `${formatNumber(metrics.totalLinks - metrics.activeLinks)} expired`,
    },
    {
      label: "Password protected",
      value: formatNumber(metrics.protectedLinks),
      hint: metrics.protectedLinks === 1 ? "link" : "links",
    },
  ];

  return (
    <>
      <PageHeader title="Links" description="Create, share, and track your short links." />
      <StatStrip stats={stats} />
      <LinkTable links={links} />
      <Suspense>
        <NewLinkDialog />
      </Suspense>
    </>
  );
}
