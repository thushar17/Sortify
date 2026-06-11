import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Clock,
  ExternalLink,
  KeyRound,
  Link2,
  QrCode,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "URL Shortening",
    description:
      "Turn any long URL into a clean, shareable short link in under a second.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track browsers, devices, countries, and click timelines with rich visualizations.",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description:
      "Generate a QR code for any short link instantly, ready to download.",
  },
  {
    icon: ShieldCheck,
    title: "Password Protection",
    description:
      "Add a password to any link — visitors must verify before they're redirected.",
  },
  {
    icon: Clock,
    title: "Link Expiry",
    description:
      "Set an expiration date and time. Expired links automatically stop working.",
  },
  {
    icon: KeyRound,
    title: "REST API",
    description:
      "Programmatic access via API keys. Create, manage, and analyze links at scale.",
  },
];

const steps = [
  {
    number: "01",
    title: "Sign in with Google",
    description:
      "One click — no passwords, no forms. Instant authenticated workspace.",
  },
  {
    number: "02",
    title: "Paste your long URL",
    description:
      "Add an optional custom slug, expiry date, or password protection.",
  },
  {
    number: "03",
    title: "Share & track",
    description:
      "Your short link is live. Watch clicks, countries, and devices roll in.",
  },
];

const stats = [
  { value: "10k+", label: "Links shortened" },
  { value: "50k+", label: "Clicks tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 100ms", label: "Redirect latency" },
];

const previewRows = [
  { slug: "/launch", destination: "https://sortify.dev/launch", clicks: "2.4k" },
  { slug: "/api", destination: "https://sortify.dev/docs/api", clicks: "1.1k" },
  { slug: "/docs", destination: "https://sortify.dev/docs", clicks: "986" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl border border-white/80 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-sm font-semibold text-white shadow-[0_10px_22px_rgba(59,130,246,0.18)]">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#0f172a]">
              Sortify
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#475569] transition-colors hover:text-[#0f172a]"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-[#475569] transition-colors hover:text-[#0f172a]"
            >
              Docs
            </Link>
            <Link href="/sign-in" className="primary-button h-9 px-4 text-xs">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-center lg:pt-24">
          <div>
            <div className="eyebrow mb-6">
              <Zap className="size-3 text-[#3b82f6]" />
              URL shortening, reimagined
            </div>

            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-5xl lg:text-[4.35rem] lg:leading-[1.02]">
              Shorten. Share.{" "}
              <span className="gradient-text">Track everything.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#475569] sm:text-lg">
              Sortify turns long URLs into clean short links with built-in analytics,
              QR codes, password protection, and a full REST API.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-in" className="primary-button h-11 px-5 text-sm">
                Get started free
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/docs" className="secondary-button h-11 px-5 text-sm">
                <ExternalLink className="size-4" />
                View docs
              </Link>
            </div>
          </div>

          <div className="glass-card overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">
                  Live workspace preview
                </p>
                <p className="text-xs text-[#64748b]">
                  A quick look at the dashboard feel.
                </p>
              </div>
              <span className="rounded-full border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.6)] px-2.5 py-1 text-xs text-[#64748b]">
                Real-time
              </span>
            </div>

            <div className="space-y-4">
              <div className="surface-muted p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                      Short link
                    </p>
                    <p className="mt-2 font-mono text-sm text-[#4f46e5]">
                      sortify.dev/launch
                    </p>
                    <p className="mt-1 truncate text-sm text-[#64748b]">
                      https://sortify.dev/launch-campaign/2026
                    </p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(59,130,246,0.1)]">
                    <BarChart3 className="size-5 text-[#3b82f6]" />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.slice(0, 3).map((stat) => (
                  <div
                    key={stat.label}
                    className="surface-muted flex flex-col items-start p-4"
                  >
                    <p className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#0f172a]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-[#64748b]">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.78)] bg-[rgba(255,255,255,0.58)]">
                <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.14)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                    Recent links
                  </p>
                  <span className="text-xs text-[#64748b]">Today</span>
                </div>
                <div className="divide-y divide-[rgba(148,163,184,0.1)]">
                  {previewRows.map((row) => (
                    <div key={row.slug} className="flex items-center gap-4 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm font-medium text-[#4f46e5]">
                          {row.slug}
                        </p>
                        <p className="truncate text-sm text-[#64748b]">
                          {row.destination}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[#0f172a]">
                        {row.clicks}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.42)] backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-2 divide-x divide-[rgba(148,163,184,0.16)] md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-[#475569]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              Everything a link needs
            </h2>
            <p className="mt-4 text-base text-[#475569]">
              Built for developers and teams who want more than just a short URL.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card p-6">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-[rgba(59,130,246,0.1)]">
                    <Icon className="size-5 text-[#3b82f6]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f172a]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#475569]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.42)] backdrop-blur-sm py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                From long URL to live link in seconds
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.number} className="relative flex flex-col gap-4">
                  {i < steps.length - 1 && (
                    <div className="absolute right-0 top-6 hidden w-[calc(100%-3rem)] translate-x-1/2 border-t border-dashed border-[rgba(148,163,184,0.4)] md:block" />
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.78)] bg-[rgba(255,255,255,0.8)] font-mono text-sm font-semibold text-[#4f46e5] shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f172a]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#475569]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[rgba(148,163,184,0.18)] py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <div className="glass-card p-8">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                Ready to shorten smarter?
              </h2>
              <p className="mt-4 text-[#475569]">
                Sign in with Google — no credit card, no setup. Start shortening in seconds.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link href="/sign-in" className="primary-button h-11 px-6 text-sm">
                  Get started free
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.56)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-lg bg-[rgba(59,130,246,0.1)] text-xs font-semibold text-[#3b82f6]">
              S
            </div>
            <span className="text-sm font-medium text-[#475569]">Sortify</span>
          </div>

          <nav className="flex gap-6">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/docs", label: "Docs" },
              { href: "https://github.com", label: "GitHub" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#475569] transition-colors hover:text-[#0f172a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-[#64748b]">
            © {new Date().getFullYear()} Sortify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
