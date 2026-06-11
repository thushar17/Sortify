"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Globe, Monitor, Share2 } from "lucide-react";
import { toast } from "sonner";
import type { CSSProperties } from "react";

import AnalyticsChart from "@/components/AnalyticsChart";

type AnalyticsData = {
  totalClicks: number;
  browsers: Record<string, number>;
  devices: Record<string, number>;
  countries: Record<string, number>;
  clicksByDay: Array<{ date: string; clicks: number }>;
};

type Props = {
  slug: string;
  originalUrl: string;
  analytics: AnalyticsData;
};

type Tab = "overview" | "browsers" | "devices" | "countries";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "browsers", label: "Browsers" },
  { id: "devices", label: "Devices" },
  { id: "countries", label: "Countries" },
];

const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  India: "🇮🇳",
  Germany: "🇩🇪",
  France: "🇫🇷",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Brazil: "🇧🇷",
  Japan: "🇯🇵",
  China: "🇨🇳",
  Russia: "🇷🇺",
  Mexico: "🇲🇽",
  Spain: "🇪🇸",
  Italy: "🇮🇹",
  Netherlands: "🇳🇱",
  Unknown: "🌐",
};

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? "🏳️";
}

export function AnalyticsTabs({ slug, originalUrl, analytics }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  const browserChartData = Object.entries(analytics.browsers).map(
    ([browser, count]) => ({ browser, clicks: Number(count) })
  );
  const deviceChartData = Object.entries(analytics.devices).map(
    ([device, count]) => ({ device, clicks: Number(count) })
  );
  const countryData = Object.entries(analytics.countries)
    .sort(([, a], [, b]) => Number(b) - Number(a))
    .map(([country, count]) => ({ country, clicks: Number(count) }));
  const totalForPercent = countryData.reduce((s, c) => s + c.clicks, 0);

  function handleShare() {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Analytics URL copied to clipboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748b] transition-colors hover:text-[#0f172a]"
          >
            <ArrowLeft className="size-3.5" />
            Dashboard
          </Link>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#0f172a]">
            Analytics{" "}
            <span className="font-mono text-[#4f46e5]">/{slug}</span>
          </h1>
          <p className="max-w-lg truncate text-sm text-[#475569]">
            {originalUrl}
          </p>
        </div>
        <button
          onClick={handleShare}
          className="secondary-button h-8 self-start px-3 text-xs"
        >
          <Share2 className="size-3.5" />
          Share analytics
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total clicks",
            value: analytics.totalClicks,
            icon: BarChart3,
            color: "text-[#3b82f6]",
            bg: "bg-[rgba(59,130,246,0.1)]",
            borderAccent: "#3b82f6",
          },
          {
            label: "Top browser",
            value: browserChartData[0]?.browser ?? "—",
            icon: Monitor,
            color: "text-[#8b5cf6]",
            bg: "bg-[rgba(139,92,246,0.1)]",
            borderAccent: "#8b5cf6",
          },
          {
            label: "Top country",
            value: countryData[0]?.country ?? "—",
            icon: Globe,
            color: "text-[#22c55e]",
            bg: "bg-[rgba(34,197,94,0.1)]",
            borderAccent: "#22c55e",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="glass-card metric-card"
              style={{ "--metric-accent": card.borderAccent } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                    {card.label}
                  </p>
                  <p className="mt-2 truncate text-[1.5rem] font-semibold tracking-[-0.03em] text-[#0f172a]">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex size-11 flex-shrink-0 items-center justify-center rounded-2xl ${card.bg}`}
                >
                  <Icon className={`size-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex gap-2 border-b border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.36)] p-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-[rgba(79,70,229,0.12)] text-[#4f46e5]"
                  : "text-[#64748b] hover:bg-[rgba(255,255,255,0.55)] hover:text-[#0f172a]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {tab === "overview" && (
            <div className="flex flex-col gap-6">
              {analytics.clicksByDay.length > 0 ? (
                <AnalyticsChart
                  data={analytics.clicksByDay}
                  xKey="date"
                  type="line"
                  title="Clicks over time"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.72)] bg-[rgba(255,255,255,0.5)] py-12">
                  <BarChart3 className="size-6 text-[#64748b]" />
                  <p className="text-sm text-[#475569]">
                    No click history yet. Share your link to start tracking.
                  </p>
                </div>
              )}
              <div className="grid gap-6 sm:grid-cols-2">
                <AnalyticsChart data={browserChartData} xKey="browser" />
                <AnalyticsChart data={deviceChartData} xKey="device" />
              </div>
            </div>
          )}

          {tab === "browsers" && (
            <AnalyticsChart data={browserChartData} xKey="browser" />
          )}

          {tab === "devices" && (
            <AnalyticsChart data={deviceChartData} xKey="device" />
          )}

          {tab === "countries" && (
            <div>
              {countryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.72)] bg-[rgba(255,255,255,0.5)] py-12">
                  <Globe className="size-6 text-[#64748b]" />
                  <p className="text-sm text-[#475569]">No country data yet.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[rgba(148,163,184,0.1)]">
                  {countryData.map(({ country, clicks }) => {
                    const pct =
                      totalForPercent > 0
                        ? Math.round((clicks / totalForPercent) * 100)
                        : 0;
                    return (
                      <div
                        key={country}
                        className="flex items-center gap-4 py-3"
                      >
                        <span className="text-xl leading-none">
                          {getFlag(country)}
                        </span>
                        <span className="w-40 flex-shrink-0 text-sm font-medium text-[#0f172a]">
                          {country}
                        </span>
                        <div className="flex flex-1 items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[rgba(100,116,139,0.15)]">
                            <div
                              className="h-full rounded-full bg-[#3b82f6]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-xs font-medium text-[#64748b]">
                            {pct}%
                          </span>
                        </div>
                        <span className="w-12 text-right text-sm font-semibold text-[#020617]">
                          {clicks}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
