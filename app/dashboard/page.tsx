import { Activity, Link2, MousePointerClick } from "lucide-react";

import CreateLinkForm from "@/components/CreateLinkForm";
import LinkTable from "@/components/LinkTable";
import {
  formatDashboardLinks,
  getAuthenticatedDashboardContext,
  getLinkMetrics,
  getUserLinksWithClicks,
} from "@/lib/dashboard";
import type { CSSProperties } from "react";

export default async function getDashboard() {
  const { user } = await getAuthenticatedDashboardContext();
  const dbLinks = await getUserLinksWithClicks(user.id);
  const links = formatDashboardLinks(dbLinks);
  const { totalLinks, totalClicks, activeLinks } = getLinkMetrics(links);

  const metrics = [
    {
      label: "Total links",
      value: totalLinks,
      icon: Link2,
      color: "text-[#3b82f6]",
      bg: "bg-[rgba(59,130,246,0.1)]",
      borderAccent: "#3b82f6",
    },
    {
      label: "Total clicks",
      value: totalClicks,
      icon: MousePointerClick,
      color: "text-[#8b5cf6]",
      bg: "bg-[rgba(139,92,246,0.1)]",
      borderAccent: "#8b5cf6",
    },
    {
      label: "Active links",
      value: activeLinks,
      icon: Activity,
      color: "text-[#22c55e]",
      bg: "bg-[rgba(34,197,94,0.1)]",
      borderAccent: "#22c55e",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#0f172a]">
            Dashboard
          </h1>
          <p className="text-sm text-[#475569]">
            Manage your short links and monitor performance.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="glass-card metric-card"
              style={{ "--metric-accent": metric.borderAccent } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-[#0f172a]">
                    {metric.value}
                  </p>
                </div>
                <div
                  className={`flex size-11 flex-shrink-0 items-center justify-center rounded-2xl ${metric.bg}`}
                >
                  <Icon className={`size-5 ${metric.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create link form */}
      <CreateLinkForm />

      {/* Link table */}
      <LinkTable links={links} />
    </div>
  );
}
