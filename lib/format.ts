const DAY = 24 * 60 * 60 * 1000;

export function getShortUrl(slug: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`;
}

export function getShortHost() {
  return getHost(process.env.NEXT_PUBLIC_APP_URL ?? "");
}

export function getHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function splitUrl(url: string) {
  try {
    const parsed = new URL(url);
    const rest = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return {
      host: parsed.host.replace(/^www\./, ""),
      path: rest === "/" ? "" : rest,
    };
  } catch {
    return { host: url, path: "" };
  }
}

export function normalizeUrl(input: string) {
  const value = input.trim();
  if (!value || /^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelative(date: Date | string, now = new Date()) {
  const diff = new Date(date).getTime() - now.getTime();
  const abs = Math.abs(diff);

  if (abs < 60 * 1000) return "just now";
  if (abs < 60 * 60 * 1000) return relativeFormat.format(Math.round(diff / 60000), "minute");
  if (abs < DAY) return relativeFormat.format(Math.round(diff / 3600000), "hour");
  if (abs < 30 * DAY) return relativeFormat.format(Math.round(diff / DAY), "day");
  if (abs < 365 * DAY) return relativeFormat.format(Math.round(diff / (30 * DAY)), "month");
  return relativeFormat.format(Math.round(diff / (365 * DAY)), "year");
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
