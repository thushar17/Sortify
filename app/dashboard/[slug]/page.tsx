import type { Metadata } from "next";
import { redirect } from "next/navigation";

import BarList from "@/components/app/bar-list";
import ClicksChart from "@/components/app/clicks-chart";
import EmptyState from "@/components/app/empty-state";
import LinkActions from "@/components/app/link-actions";
import RangeTabs from "@/components/app/range-tabs";
import StatusBadge from "@/components/app/status-badge";
import { getCountryFlag } from "@/lib/countries";
import { getAuthenticatedDashboardContext } from "@/lib/dashboard";
import { formatDateTime, formatNumber, getShortHost, getShortUrl, splitUrl } from "@/lib/format";
import { getLinkAnalytics, parseRange, RANGES } from "@/lib/link-analytics";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `/${slug} analytics` };
}

function Change({ current, previous }: { current: number; previous: number | null }) {
  if (previous == null) return null;
  if (previous === 0) {
    return <span className="text-xs text-muted-foreground">No clicks in the previous period</span>;
  }
  const change = Math.round(((current - previous) / previous) * 100);
  return (
    <span className="text-xs text-muted-foreground">
      <span
        className={cn(
          "font-mono tabular-nums",
          change > 0 && "text-success",
          change < 0 && "text-destructive"
        )}
      >
        {change > 0 ? "+" : ""}
        {change}%
      </span>{" "}
      vs previous period
    </span>
  );
}

export default async function LinkAnalyticsPage({ params, searchParams }: Props) {
  const { user } = await getAuthenticatedDashboardContext();
  const { slug } = await params;
  const range = parseRange((await searchParams).range);

  const link = await prisma.link.findUnique({
    where: { slug },
    select: { id: true, slug: true, originalUrl: true, createdAt: true, expiresAt: true, password: true, userId: true },
  });

  if (!link || link.userId !== user.id) {
    redirect("/dashboard");
  }

  const analytics = await getLinkAnalytics(link, range);
  const destination = splitUrl(link.originalUrl);
  const shortUrl = getShortUrl(link.slug);

  return (
    <>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h1 className="truncate font-mono text-xl font-medium tracking-tight">
            <span className="text-muted-foreground">{getShortHost()}/</span>
            <span className="text-foreground">{link.slug}</span>
          </h1>
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-2 text-sm hover:underline hover:decoration-border-strong hover:underline-offset-4"
            title={link.originalUrl}
          >
            <span className="text-muted-foreground">→</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(destination.host)}&sz=32`}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0 rounded-sm"
            />
            <span className="truncate">
              <span className="text-foreground">{destination.host}</span>
              <span className="text-muted-foreground">{destination.path}</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[13px] text-muted-foreground">
            <StatusBadge expiresAt={link.expiresAt} hasPassword={Boolean(link.password)} />
            <span>Created {formatDateTime(link.createdAt)}</span>
            {link.expiresAt && <span>Expires {formatDateTime(link.expiresAt)}</span>}
          </div>
        </div>
        <LinkActions link={{ id: link.id, slug: link.slug, totalClicks: analytics.allTimeTotal }} />
      </header>

      <section className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] text-muted-foreground">
              Clicks, {RANGES[range].label.toLowerCase()}
            </p>
            <div className="mt-0.5 flex items-baseline gap-3">
              <p className="font-mono text-2xl font-medium tabular-nums tracking-tight">
                {formatNumber(analytics.total)}
              </p>
              <Change current={analytics.total} previous={analytics.previousTotal} />
            </div>
          </div>
          <RangeTabs basePath={`/dashboard/${link.slug}`} active={range} />
        </div>
        {analytics.allTimeTotal === 0 ? (
          <EmptyState
            title="No clicks yet"
            description={`Share ${shortUrl.replace(/^https?:\/\//, "")} and visits will show up here.`}
          />
        ) : (
          <div className="px-2 pb-2 pt-4">
            <ClicksChart data={analytics.series} />
          </div>
        )}
      </section>

      {analytics.allTimeTotal > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <BarList
            title="Countries"
            items={analytics.countries.map((item) => ({ ...item, prefix: getCountryFlag(item.label) }))}
          />
          <BarList title="Devices" items={analytics.devices} />
          <BarList title="Browsers" items={analytics.browsers} />
        </div>
      )}
    </>
  );
}
