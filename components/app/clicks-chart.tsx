"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatNumber } from "@/lib/format";

type Point = { date: string; clicks: number };

function formatDay(date: string, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-float">
      <p className="text-muted-foreground">
        {formatDay(point.date, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
      </p>
      <p className="mt-0.5 font-mono font-medium tabular-nums text-foreground">
        {formatNumber(point.clicks)} {point.clicks === 1 ? "click" : "clicks"}
      </p>
    </div>
  );
}

export default function ClicksChart({ data }: { data: Point[] }) {
  const tick = { fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatDay(value)}
            tick={tick}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            minTickGap={32}
            tickMargin={8}
          />
          <YAxis
            allowDecimals={false}
            tick={tick}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(value: number) => formatNumber(value)}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="var(--chart-1)"
            strokeWidth={1.75}
            fill="var(--chart-1)"
            fillOpacity={0.12}
            activeDot={{ r: 3.5, fill: "var(--chart-1)", stroke: "var(--card)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
