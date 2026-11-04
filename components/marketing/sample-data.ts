import type { DashboardLink } from "@/lib/dashboard";

const DAY = 24 * 60 * 60 * 1000;
// Relative to the visitor's clock so "3 days ago" and expiry states never go stale.
const NOW = Date.now();

const ago = (days: number) => new Date(NOW - days * DAY);
const ahead = (days: number) => new Date(NOW + days * DAY);

export const sampleLinks: DashboardLink[] = [
  {
    id: "1",
    slug: "spring-sale",
    originalUrl: "https://shop.example.com/collections/spring?utm_source=newsletter&utm_medium=email",
    totalClicks: 1284,
    dailyClicks: [96, 120, 143, 131, 168, 190, 214],
    hasPassword: false,
    createdAt: ago(3),
    expiresAt: ahead(30),
  },
  {
    id: "2",
    slug: "q3-board-deck",
    originalUrl: "https://docs.google.com/presentation/d/1a2b3c4d5e/edit",
    totalClicks: 37,
    dailyClicks: [0, 4, 9, 6, 2, 1, 3],
    hasPassword: true,
    createdAt: ago(8),
    expiresAt: null,
  },
  {
    id: "3",
    slug: "release-notes",
    originalUrl: "https://github.com/thushar17/Sortify/releases",
    totalClicks: 512,
    dailyClicks: [44, 38, 52, 47, 61, 55, 49],
    hasPassword: false,
    createdAt: ago(16),
    expiresAt: null,
  },
  {
    id: "4",
    slug: "beta-invite",
    originalUrl: "https://forms.example.com/beta-signup",
    totalClicks: 209,
    dailyClicks: [0, 0, 0, 0, 0, 0, 0],
    hasPassword: false,
    createdAt: ago(41),
    expiresAt: ago(2),
  },
];

export const sampleControlRows = [
  { slug: "launch-week", expiresAt: ahead(2), hasPassword: false },
  { slug: "q3-board-deck", expiresAt: null, hasPassword: true },
  { slug: "beta-invite", expiresAt: ago(1), hasPassword: false },
];

export const sampleStats = [
  { label: "Links", value: "4", hint: "3 active" },
  {
    label: "Clicks, last 30 days",
    value: "1,872",
    change: 21,
    hint: "vs previous 30 days",
    trend: [22, 30, 28, 35, 31, 40, 38, 45, 41, 50, 47, 52, 49, 58, 55, 61, 57, 66, 63, 70, 65, 74, 72, 80, 77, 85, 90, 96, 104, 112],
  },
  { label: "Active", value: "3", hint: "1 expired" },
  { label: "Password protected", value: "1", hint: "link" },
];

export const sampleSeries = Array.from({ length: 30 }, (_, index) => ({
  date: new Date(NOW - (29 - index) * DAY).toISOString().slice(0, 10),
  clicks: Math.round(40 + index * 2.4 + 14 * Math.sin(index / 2.2) + (index % 7 === 5 ? -12 : 0)),
}));

export const sampleCountries = [
  { label: "India", value: 642, prefix: "🇮🇳" },
  { label: "United States", value: 418, prefix: "🇺🇸" },
  { label: "Germany", value: 151, prefix: "🇩🇪" },
  { label: "United Kingdom", value: 96, prefix: "🇬🇧" },
  { label: "Brazil", value: 41, prefix: "🇧🇷" },
];

export const sampleDevices = [
  { label: "Mobile", value: 812 },
  { label: "Desktop", value: 536 },
];
