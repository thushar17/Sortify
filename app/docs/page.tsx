import Link from "next/link";
import {
  KeyRound,
  Link2,
  BarChart3,
  Trash2,
  ArrowRight,
} from "lucide-react";

export default function DocsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="glass-card section-shell">
        <div className="space-y-4">
          <span className="eyebrow">Developer Documentation</span>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Sortify API
          </h1>

          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Use Sortify programmatically to create, manage and analyze short
            links using API Keys generated from your profile page.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/profile" className="primary-button">
              Generate API Key
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="glass-card section-shell">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <KeyRound className="size-5" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Authentication
            </h2>
            <p className="text-sm text-slate-500">
              Every request must include your API key.
            </p>
          </div>
        </div>

        <div className="subtle-divider mt-6" />

        <div className="mt-6 space-y-4">
          <p className="text-slate-700">
            Send your API key in the request header:
          </p>

          <pre className="surface-muted overflow-auto rounded-2xl p-4 font-mono text-sm">
{`x-api-key: sk_sortify_xxxxxxxxxxxxxxxxx`}
          </pre>
        </div>
      </section>

      {/* Create Link */}
      <section className="glass-card section-shell">
        <div className="flex items-center gap-3">
          <Link2 className="size-5 text-blue-600" />
          <h2 className="text-2xl font-semibold">Create Link</h2>
        </div>

        <div className="mt-4">
          <span className="status-badge">POST /api/v1/links</span>
        </div>

        <div className="mt-6 space-y-4">
          <p className="font-medium">Request Body</p>

          <pre className="surface-muted overflow-auto rounded-2xl p-4 font-mono text-sm">
{`{
  "url": "https://google.com",
  "slug": "google"
}`}
          </pre>

          <p className="font-medium">Response</p>

          <pre className="surface-muted overflow-auto rounded-2xl p-4 font-mono text-sm">
{`{
  "success": true,
  "shortUrl": "https://your-domain.com/google"
}`}
          </pre>
        </div>
      </section>

      {/* Get Links */}
      <section className="glass-card section-shell">
        <div className="flex items-center gap-3">
          <Link2 className="size-5 text-blue-600" />
          <h2 className="text-2xl font-semibold">Get All Links</h2>
        </div>

        <div className="mt-4">
          <span className="status-badge">GET /api/v1/links</span>
        </div>

        <div className="mt-6">
          <pre className="surface-muted overflow-auto rounded-2xl p-4 font-mono text-sm">
{`{
  "links": [
    {
      "id": "...",
      "slug": "google",
      "originalUrl": "https://google.com",
      "clicks": 15
    }
  ]
}`}
          </pre>
        </div>
      </section>

      {/* Analytics */}
      <section className="glass-card section-shell">
        <div className="flex items-center gap-3">
          <BarChart3 className="size-5 text-blue-600" />
          <h2 className="text-2xl font-semibold">Analytics</h2>
        </div>

        <div className="mt-4">
          <span className="status-badge">
            GET /api/v1/analytics/[slug]
          </span>
        </div>

        <div className="mt-6">
          <pre className="surface-muted overflow-auto rounded-2xl p-4 font-mono text-sm">
{`{
  "slug": "google",
  "totalClicks": 25,
  "clicks": [...]
}`}
          </pre>
        </div>
      </section>

      {/* Delete */}
      <section className="glass-card section-shell">
        <div className="flex items-center gap-3">
          <Trash2 className="size-5 text-red-500" />
          <h2 className="text-2xl font-semibold">Delete Link</h2>
        </div>

        <div className="mt-4">
          <span className="status-badge">
            DELETE /api/v1/links/[slug]
          </span>
        </div>

        <div className="mt-6">
          <pre className="surface-muted overflow-auto rounded-2xl p-4 font-mono text-sm">
{`{
  "success": true
}`}
          </pre>
        </div>
      </section>
    </main>
  );
}