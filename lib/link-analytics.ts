import { prisma } from "@/lib/prisma";

const DAY = 24 * 60 * 60 * 1000;

export const RANGES = {
  "7d": { label: "7 days", days: 7 },
  "30d": { label: "30 days", days: 30 },
  "90d": { label: "90 days", days: 90 },
  all: { label: "All time", days: null },
} as const;

export type Range = keyof typeof RANGES;

export function parseRange(value: string | string[] | undefined): Range {
  return typeof value === "string" && value in RANGES ? (value as Range) : "30d";
}

export type BreakdownItem = { label: string; value: number };

function toDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function countBy<T>(items: T[], key: (item: T) => string | null): BreakdownItem[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const label = key(item) || "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export async function getLinkAnalytics(
  link: { id: string; createdAt: Date },
  range: Range,
  now = new Date()
) {
  const today = startOfUtcDay(now);
  const days = RANGES[range].days;
  const firstDay = days
    ? new Date(today.getTime() - (days - 1) * DAY)
    : startOfUtcDay(link.createdAt);

  const [clicks, previousTotal, allTimeTotal] = await Promise.all([
    prisma.click.findMany({
      where: { linkId: link.id, createdAt: { gte: firstDay } },
      select: { createdAt: true, browser: true, device: true, country: true },
    }),
    days
      ? prisma.click.count({
          where: {
            linkId: link.id,
            createdAt: { gte: new Date(firstDay.getTime() - days * DAY), lt: firstDay },
          },
        })
      : Promise.resolve(null),
    prisma.click.count({ where: { linkId: link.id } }),
  ]);

  const perDay = new Map<string, number>();
  for (const click of clicks) {
    const key = toDayKey(click.createdAt);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const series: { date: string; clicks: number }[] = [];
  for (let time = firstDay.getTime(); time <= today.getTime(); time += DAY) {
    const key = toDayKey(new Date(time));
    series.push({ date: key, clicks: perDay.get(key) ?? 0 });
  }

  return {
    total: clicks.length,
    previousTotal,
    allTimeTotal,
    series,
    countries: countBy(clicks, (click) => click.country),
    devices: countBy(clicks, (click) => click.device),
    browsers: countBy(clicks, (click) => click.browser),
  };
}

export type LinkAnalytics = Awaited<ReturnType<typeof getLinkAnalytics>>;
