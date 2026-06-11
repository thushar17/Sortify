import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(req: Request, { params }: Props) {
  const { slug } = await params;
  const link = await prisma.link.findUnique({
    where: { slug },
    include: { clicks: true },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  const browsers: Record<string, number> = {};
  const devices: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const clicksByDayMap: Record<string, number> = {};

  for (const click of link.clicks) {
    // Browsers
    const browser = click.browser || "Unknown";
    browsers[browser] = (browsers[browser] || 0) + 1;

    // Devices
    const device = click.device || "Unknown";
    devices[device] = (devices[device] || 0) + 1;

    // Countries
    const country = click.country || "Unknown";
    countries[country] = (countries[country] || 0) + 1;

    // Clicks by day (group by YYYY-MM-DD)
    const day = new Date(click.createdAt).toISOString().slice(0, 10);
    clicksByDayMap[day] = (clicksByDayMap[day] || 0) + 1;
  }

  // Convert clicksByDay map to sorted array
  const clicksByDay = Object.entries(clicksByDayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, clicks]) => ({ date, clicks }));

  return NextResponse.json({
    totalClicks: link.clicks.length,
    browsers,
    devices,
    countries,
    clicksByDay,
  });
}