import { ArrowLeft, BarChart3, Globe, MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import AnalyticsChart from "@/components/AnalyticsChart";
import DashboardTopNav from "@/components/dashboard/DashboardTopNav";
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
  const { session, user } = await getAuthenticatedDashboardContext();
  const { slug } = await params;

  const link = await prisma.link.findUnique({
    where: {
      slug,
    },
  });

  if (!link || link.userId !== user.id) {
    redirect("/dashboard");
  }

  const analytics = await getAnalytics(slug);

  const browserChartData = Object.entries(analytics.browsers).map(
    ([browser, count]) => ({
      browser,
      clicks: Number(count),
    })
  );

  const deviceChartData = Object.entries(analytics.devices).map(
    ([device, count]) => ({
      device,
      clicks: Number(count),
    })
  );
const countryChartData = Object.entries(
  analytics.countries
).map(([country, count]) => ({
  country,
  clicks: Number(count),
}));
  const topBrowser =
    browserChartData.reduce(
      (winner, item) => (item.clicks > winner.clicks ? item : winner),
      browserChartData[0] ?? { browser: "No data", clicks: 0 }
    )?.browser ?? "No data";

  const topDevice =
    deviceChartData.reduce(
      (winner, item) => (item.clicks > winner.clicks ? item : winner),
      deviceChartData[0] ?? { device: "No data", clicks: 0 }
    )?.device ?? "No data";

  const analyticsCards = [
    {
      label: "Total clicks",
      value: analytics.totalClicks,
      detail: "Total visits recorded for this short link.",
      icon: BarChart3,
    },
    {
      label: "Top browser",
      value: topBrowser,
      detail: "Browser driving the highest share of visits.",
      icon: Globe,
    },
    {
      label: "Top device",
      value: topDevice,
      detail: "Most common device category for visitors.",
      icon: MonitorSmartphone,
    },
  ];

  return (
    <>
      <DashboardTopNav
        title="Analytics"
        description={`Performance insights and traffic breakdowns for /${slug}.`}
        userName={session.user?.name}
        userEmail={session.user?.email}
        userImage={session.user?.image}
      />

      <section className="glass-card section-shell">
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <Link href="/dashboard" className="secondary-button w-fit">
                <ArrowLeft className="size-4" />
                <span>Back to dashboard</span>
              </Link>

              <div className="space-y-3">
                <span className="eyebrow">Analytics</span>
                <div className="space-y-2">
                  <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Performance insights for{" "}
                    <span className="gradient-text">/{slug}</span>
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    Review total engagement and traffic distribution for this
                    short link across browsers and devices.
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-muted max-w-md px-4 py-3 text-sm text-slate-600">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Destination URL
              </p>
              <p className="mt-2 break-all leading-6 text-slate-700">
                {link.originalUrl}
              </p>
            </div>
          </div>

          <div className="subtle-divider" />

          <div className="grid gap-4 xl:grid-cols-3">
            {analyticsCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.label} className="metric-card">
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-500">
                        {card.label}
                      </p>
                      <p className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
                        {card.value}
                      </p>
                      <p className="max-w-xs text-sm leading-6 text-slate-600">
                        {card.detail}
                      </p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-blue-700 shadow-[0_14px_30px_rgba(59,130,246,0.12)]">
                      <Icon className="size-5" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <AnalyticsChart data={browserChartData} xKey="browser" />
        <AnalyticsChart data={deviceChartData} xKey="device" />
        <AnalyticsChart
  xKey="Countries"
  data={countryChartData}
/>
      </div>
    </>
  );
}
