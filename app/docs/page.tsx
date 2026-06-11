import Link from "next/link";
import { ArrowRight, BarChart3, KeyRound, Link2, Trash2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Docs | Sortify",
  description:
    "Sortify REST API documentation — create, manage, and analyze short links programmatically.",
};

const endpoints = [
  {
    id: "authentication",
    method: null,
    title: "Authentication",
    icon: KeyRound,
    iconColor: "text-[#3b82f6]",
    description:
      "Include your API key in every request using the x-api-key header.",
    request: `x-api-key: sk_sortify_xxxxxxxxxxxxxxxxx`,
    response: null,
  },
  {
    id: "create-link",
    method: "POST",
    title: "Create Link",
    icon: Link2,
    iconColor: "text-[#3b82f6]",
    endpoint: "POST /api/v1/links",
    description:
      "Create a new short link. Optionally provide a custom slug, expiry date, and password.",
    request: `{
  "url": "https://example.com/very-long-url",
  "slug": "my-link",            // optional
  "expiresAt": "2025-12-31",   // optional ISO date
  "password": "secret"          // optional
}`,
    response: `{
  "success": true,
  "shortUrl": "https://your-domain.com/my-link"
}`,
  },
  {
    id: "get-links",
    method: "GET",
    title: "Get All Links",
    icon: Link2,
    iconColor: "text-[#22c55e]",
    endpoint: "GET /api/v1/links",
    description: "Retrieve all short links associated with your API key.",
    request: null,
    response: `{
  "links": [
    {
      "id": "clxyz...",
      "slug": "my-link",
      "originalUrl": "https://example.com/very-long-url",
      "clicks": 42,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}`,
  },
  {
    id: "analytics",
    method: "GET",
    title: "Analytics",
    icon: BarChart3,
    iconColor: "text-[#8b5cf6]",
    endpoint: "GET /api/v1/analytics/:slug",
    description:
      "Get detailed analytics for a short link — total clicks, browser breakdown, device breakdown, countries, and a click timeline.",
    request: null,
    response: `{
  "slug": "my-link",
  "totalClicks": 42,
  "browsers": { "Chrome": 30, "Firefox": 8, "Safari": 4 },
  "devices": { "Desktop": 35, "Mobile": 7 },
  "countries": { "United States": 20, "India": 12 },
  "clicksByDay": [
    { "date": "2024-01-15", "clicks": 10 },
    { "date": "2024-01-16", "clicks": 32 }
  ]
}`,
  },
  {
    id: "delete-link",
    method: "DELETE",
    title: "Delete Link",
    icon: Trash2,
    iconColor: "text-[#ef4444]",
    endpoint: "DELETE /api/v1/links/:slug",
    description: "Permanently delete a short link and all its analytics data.",
    request: null,
    response: `{
  "success": true
}`,
  },
];

function MethodBadge({ method }: { method: string }) {
  const cls =
    method === "POST"
      ? "border border-[rgba(59,130,246,0.18)] bg-[rgba(59,130,246,0.1)] px-2 py-0.5 rounded-full font-mono text-[0.65rem] font-semibold text-[#3b82f6]"
      : method === "GET"
        ? "border border-[rgba(34,197,94,0.18)] bg-[rgba(34,197,94,0.1)] px-2 py-0.5 rounded-full font-mono text-[0.65rem] font-semibold text-[#16a34a]"
        : method === "DELETE"
          ? "border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.1)] px-2 py-0.5 rounded-full font-mono text-[0.65rem] font-semibold text-[#ef4444]"
          : "border border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.56)] px-2 py-0.5 rounded-full font-mono text-[0.65rem] font-semibold text-[#475569]";
  return <span className={cls}>{method}</span>;
}

export default function DocsPage() {
  return (
    <div className="min-h-screen">
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
            <Link href="/sign-in" className="primary-button h-9 px-4 text-xs">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:block">
            <div className="sticky top-24 glass-card p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                Endpoints
              </p>
              <nav className="flex flex-col gap-1">
                {endpoints.map((ep) => (
                  <a
                    key={ep.id}
                    href={`#${ep.id}`}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[rgba(79,70,229,0.08)] hover:text-[#0f172a]"
                  >
                    {ep.method && (
                      <span
                        className={`w-12 text-left font-mono text-[0.65rem] font-semibold ${
                          ep.method === "POST"
                            ? "text-[#3b82f6]"
                            : ep.method === "GET"
                              ? "text-[#16a34a]"
                              : "text-[#ef4444]"
                        }`}
                      >
                        {ep.method}
                      </span>
                    )}
                    <span className="truncate">{ep.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col gap-6">
            <section className="glass-card p-6 sm:p-8">
              <span className="eyebrow">REST API</span>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-5xl">
                Sortify API Reference
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#475569]">
                Create, manage, and analyze short links programmatically using API
                keys generated from your dashboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/api-keys"
                  className="primary-button h-10 px-5 text-sm"
                >
                  Generate API Key
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/dashboard" className="secondary-button h-10 px-5 text-sm">
                  Open Dashboard
                </Link>
              </div>
            </section>

            <div className="glass-card px-5 py-4">
              <p className="mb-1 text-xs font-medium text-[#64748b]">Base URL</p>
              <code className="font-mono text-sm font-semibold text-[#4f46e5]">
                https://your-domain.com
              </code>
            </div>

            {endpoints.map((ep) => {
              const Icon = ep.icon;
              return (
                <section
                  id={ep.id}
                  key={ep.id}
                  className="glass-card overflow-hidden scroll-mt-24"
                >
                  <div className="flex flex-col gap-3 border-b border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.36)] px-5 py-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <Icon className={`size-5 ${ep.iconColor}`} />
                      <h2 className="text-lg font-semibold text-[#0f172a]">
                        {ep.title}
                      </h2>
                      {ep.method && <MethodBadge method={ep.method} />}
                    </div>
                    {ep.endpoint && (
                      <code className="rounded-xl border border-[rgba(255,255,255,0.78)] bg-[rgba(255,255,255,0.68)] px-2.5 py-1 font-mono text-xs font-semibold text-[#64748b] sm:ml-auto">
                        {ep.endpoint}
                      </code>
                    )}
                  </div>

                  <div className="space-y-5 p-5 sm:p-6">
                    <p className="text-sm leading-7 text-[#475569] sm:text-base">
                      {ep.description}
                    </p>

                    {ep.request && (
                      <div>
                        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                          {ep.id === "authentication" ? "Header" : "Request body"}
                        </p>
                        <pre className="code-block">{ep.request}</pre>
                      </div>
                    )}

                    {ep.response && (
                      <div>
                        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                          Response
                        </p>
                        <pre className="code-block">{ep.response}</pre>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

            <div className="glass-card border border-[rgba(59,130,246,0.14)] bg-[rgba(255,255,255,0.58)] p-8 text-center">
              <h3 className="text-lg font-semibold text-[#0f172a]">
                Ready to integrate?
              </h3>
              <p className="mt-2 text-[#475569]">
                Generate your API key from the dashboard to get started.
              </p>
              <Link
                href="/dashboard/api-keys"
                className="primary-button mx-auto mt-6 h-10 px-6"
              >
                Get API Key
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
