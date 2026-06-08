import { Activity, Link2, MousePointerClick } from "lucide-react";

import CreateLinkForm from "@/components/CreateLinkForm";
import DashboardTopNav from "@/components/dashboard/DashboardTopNav";
import LinkTable from "@/components/LinkTable";
import {
  formatDashboardLinks,
  getAuthenticatedDashboardContext,
  getLinkMetrics,
  getUserLinksWithClicks,
} from "@/lib/dashboard";

export default async function getDashboard() {
  const { session, user } = await getAuthenticatedDashboardContext();
  const dbLinks = await getUserLinksWithClicks(user.id);
  const links = formatDashboardLinks(dbLinks);
  const { totalLinks, totalClicks, activeLinks } = getLinkMetrics(links);

  const metrics = [
    {
      label: "Total links",
      value: totalLinks,
      detail: "Short URLs currently managed in your workspace.",
      icon: Link2,
    },
    {
      label: "Total clicks",
      value: totalClicks,
      detail: "All engagement captured across every destination.",
      icon: MousePointerClick,
    },
    {
      label: "Active links",
      value: activeLinks,
      detail: "Links that have already generated measurable traffic.",
      icon: Activity,
    },
  ];

  return (
    <>
      <DashboardTopNav
        title="Dashboard"
        description="Create branded short links, monitor engagement, and manage your workspace from one organized authenticated layout."
        userName={session.user?.name}
        userEmail={session.user?.email}
        userImage={session.user?.image}
      />

      <section className="glass-card section-shell">
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5">
              <span className="eyebrow">Dashboard</span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl xl:text-[3.5rem]">
                  Launch, monitor, and scale links from one{" "}
                  <span className="gradient-text">premium analytics workspace</span>
                  .
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Create branded short links, review performance instantly, and
                  keep your link operations organized in a cleaner,
                  data-forward dashboard.
                </p>
              </div>
            </div>

            <div className="surface-muted px-4 py-3 text-sm text-slate-600">
              Signed in as{" "}
              <span className="font-semibold text-slate-900">
                {session.user?.name || session.user?.email}
              </span>
            </div>
          </div>

          <div className="subtle-divider" />

          <div className="grid gap-4 xl:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article key={metric.label} className="metric-card">
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-500">
                        {metric.label}
                      </p>
                      <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
                        {metric.value}
                      </p>
                      <p className="max-w-xs text-sm leading-6 text-slate-600">
                        {metric.detail}
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

      <CreateLinkForm />
      <LinkTable links={links} />
    </>
  );
}
