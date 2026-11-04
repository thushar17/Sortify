import Link from "next/link";
import { Lock } from "lucide-react";

import BarList from "@/components/app/bar-list";
import ClicksChart from "@/components/app/clicks-chart";
import LinkTable from "@/components/app/link-table";
import StatStrip from "@/components/app/stat-strip";
import StatusBadge from "@/components/app/status-badge";
import { CodeBlock, CodeGroup } from "@/components/docs/code-block";
import HeroShorten from "@/components/marketing/hero-shorten";
import {
  sampleControlRows,
  sampleCountries,
  sampleDevices,
  sampleLinks,
  sampleSeries,
  sampleStats,
} from "@/components/marketing/sample-data";
import SiteFooter from "@/components/marketing/site-footer";
import SiteHeader from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, requestSnippets } from "@/lib/api-snippets";
import { getShortHost } from "@/lib/format";

function Feature({
  label,
  title,
  description,
  points,
  footer,
  visual,
  reverse = false,
}: {
  label: string;
  title: string;
  description: string;
  points?: string[];
  footer?: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="border-t">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className={reverse ? "lg:order-2" : undefined}>
          <p className="text-sm font-medium text-primary">{label}</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
          {points && (
            <ul className="mt-6 space-y-2.5 text-sm">
              {points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-px w-3 shrink-0 bg-primary" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          )}
          {footer && <div className="mt-6">{footer}</div>}
        </div>
        <div className={reverse ? "min-w-0 lg:order-1" : "min-w-0"}>{visual}</div>
      </div>
    </section>
  );
}

function ControlVisual() {
  const host = getShortHost();
  return (
    <div className="space-y-3" inert aria-hidden="true">
      <div className="rounded-lg border bg-card p-4">
        <p className="text-sm font-medium">Expiry and password</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Expires</p>
            <p className="mt-1 flex h-9 items-center rounded-md border px-3 font-mono text-[13px]">Dec 31 · 23:59</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Password</p>
            <p className="mt-1 flex h-9 items-center gap-2 rounded-md border px-3 font-mono text-[13px]">
              <Lock className="size-3.5 text-muted-foreground" />
              ••••••••••
            </p>
          </div>
        </div>
      </div>
      <ul className="divide-y rounded-lg border bg-card text-[13px]">
        {sampleControlRows.map((row) => (
          <li key={row.slug} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="truncate font-mono">
              <span className="text-muted-foreground">{host}/</span>
              {row.slug}
            </span>
            <StatusBadge expiresAt={row.expiresAt} hasPassword={row.hasPassword} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[56px]">
            Short links with the data behind them.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Sortify turns long URLs into short ones you can share anywhere, then shows you who clicked, from
            where, and on what device.
          </p>
          <div className="mt-8">
            <HeroShorten />
            <p className="mt-3 text-[13px] text-muted-foreground">
              Free. Sign in with Google to save your links and see their clicks.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="rounded-xl border bg-muted/60 p-2 sm:p-3">
            <div className="space-y-3 rounded-lg" inert aria-hidden="true">
              <StatStrip stats={sampleStats} />
              <LinkTable links={sampleLinks} />
            </div>
          </div>
          <p className="mt-3 text-center text-[13px] text-muted-foreground">The Links page, with example data.</p>
        </section>

        <Feature
          label="Analytics"
          title="See what happens after you share."
          description="Every visit is recorded with its date, country, device, and browser. Pick a range and compare it with the one before."
          points={[
            "Daily clicks over 7, 30, or 90 days, or all time",
            "Breakdowns by country, device, and browser",
            "A 7-day trend next to every link in your list",
          ]}
          visual={
            <div className="space-y-3" inert aria-hidden="true">
              <div className="rounded-lg border bg-card px-2 pb-2 pt-4">
                <ClicksChart data={sampleSeries} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <BarList title="Countries" items={sampleCountries} />
                <BarList title="Devices" items={sampleDevices} />
              </div>
            </div>
          }
        />

        <Feature
          reverse
          label="Control"
          title="Decide how long a link lives, and who gets in."
          description="Set an expiry date and the link stops redirecting on its own. Add a password and visitors have to enter it before they're sent on."
          points={[
            "Pick your own slug, or get a random six-character one",
            "A QR code for every link, ready to download",
            "Expiring, expired, and protected links are marked in your list",
          ]}
          visual={<ControlVisual />}
        />

        <Feature
          label="API"
          title="Create links from your own code."
          description="The dashboard runs on a small REST API you can use too. Generate a key, then create, list, and delete links from scripts, servers, or CI."
          footer={
            <Link href="/docs" className="text-sm font-medium underline underline-offset-4">
              Read the API reference
            </Link>
          }
          visual={
            <div className="space-y-3">
              <CodeGroup
                snippets={requestSnippets({
                  method: "POST",
                  path: "/api/v1/links",
                  body: { url: "https://example.com/spring-collection", slug: "spring-sale" },
                })}
              />
              <CodeBlock
                title="Response"
                lang="json"
                code={JSON.stringify({ success: true, shortUrl: `${API_BASE_URL}/spring-sale` }, null, 2)}
              />
            </div>
          }
        />

        <section className="border-t">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Shorten your first link.</h2>
              <p className="mt-2 text-muted-foreground">All it takes is a Google sign-in and a URL.</p>
            </div>
            <div className="flex gap-2">
              <Button size="lg" asChild>
                <Link href="/sign-in">Sign in with Google</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">API docs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
