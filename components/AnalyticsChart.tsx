"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  type?: "bar" | "line";
  title?: string;
};

function LightTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-muted px-3 py-2 text-sm">
      <p className="font-medium text-[#0f172a]">{label}</p>
      <p className="mt-0.5 text-[#64748b]">
        <span className="font-semibold text-[#3b82f6]">
          {payload[0].value}
        </span>{" "}
        clicks
      </p>
    </div>
  );
}

export default function AnalyticsChart({
  data,
  xKey,
  type = "bar",
  title,
}: Props) {
  const label =
    title ??
    (xKey === "browser"
      ? "Browser breakdown"
      : xKey === "device"
        ? "Device breakdown"
        : xKey === "country"
          ? "Country breakdown"
          : xKey === "date"
            ? "Clicks over time"
            : "Analytics breakdown");

  const totalClicks = data.reduce(
    (sum, item) => sum + Number(item.clicks ?? 0),
    0
  );

  const tickStyle = { fill: "#64748b", fontSize: 11 };
  const gridColor = "rgba(100,116,139,0.15)";

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-[#0f172a]">{label}</h3>
        </div>
        <span className="rounded-full border border-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.6)] px-2.5 py-0.5 text-xs text-[#64748b]">
          {totalClicks} clicks
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2">
          <div className="empty-state-orb">
            <span className="text-lg font-bold">0</span>
          </div>
          <p className="text-sm text-[#64748b]">No data yet</p>
        </div>
      ) : (
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart data={data} margin={{ left: -20, right: 8 }}>
                <CartesianGrid
                  stroke={gridColor}
                  strokeDasharray="3 6"
                  vertical={false}
                />
                <XAxis
                  dataKey={xKey}
                  axisLine={false}
                  tickLine={false}
                  tick={tickStyle}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={tickStyle}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(59,130,246,0.12)" }}
                  content={<LightTooltip />}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={2.25}
                  dot={{ fill: "#3b82f6", r: 2.5 }}
                  activeDot={{ r: 4.5, fill: "#8b5cf6" }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={data}
                barCategoryGap={14}
                margin={{ left: -20, right: 8 }}
              >
                <CartesianGrid
                  stroke={gridColor}
                  strokeDasharray="3 6"
                  vertical={false}
                />
                <XAxis
                  dataKey={xKey}
                  axisLine={false}
                  tickLine={false}
                  tick={tickStyle}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={tickStyle}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(59,130,246,0.05)" }}
                  content={<LightTooltip />}
                />
                <Bar
                  dataKey="clicks"
                  radius={[8, 8, 0, 0]}
                  fill="#3b82f6"
                  background={{
                    fill: "rgba(59,130,246,0.09)",
                    radius: [8, 8, 0, 0],
                  }}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
