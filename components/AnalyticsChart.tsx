"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: Array<Record<string, string | number>>;
  xKey: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/80 bg-white/92 px-4 py-3 text-sm shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-md">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-slate-600">
        <span className="font-semibold text-slate-900">{payload[0].value}</span>{" "}
        clicks
      </p>
    </div>
  );
}

export default function AnalyticsChart({ data, xKey }: Props) {
  const label =
    xKey === "browser"
      ? "Browser breakdown"
      : xKey === "device"
        ? "Device breakdown"
        : "Analytics breakdown";

  const totalClicks = data.reduce(
    (sum, item) => sum + Number(item.clicks ?? 0),
    0
  );

  return (
    <section className="chart-shell">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">
            {label}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Segment performance by {xKey} to see where traffic is concentrated.
          </p>
        </div>
        <span className="status-badge w-fit">{totalClicks} tracked clicks</span>
      </div>

      {data.length === 0 ? (
        <div className="surface-muted flex min-h-[300px] flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="empty-state-orb text-base">0</div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-900">
              No chart data yet
            </p>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Once this link starts receiving visits, the {xKey} analytics will
              appear here automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[300px] rounded-[1.5rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(248,250,255,0.88)_100%)] px-2 py-4 sm:px-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={18}>
              <defs>
                <linearGradient id={`barGradient-${xKey}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="55%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(148, 163, 184, 0.18)"
                strokeDasharray="3 6"
                vertical={false}
              />
              <XAxis
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: "rgba(191, 219, 254, 0.18)" }} content={<CustomTooltip />} />
              <Bar
                dataKey="clicks"
                radius={[12, 12, 4, 4]}
                fill={`url(#barGradient-${xKey})`}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
