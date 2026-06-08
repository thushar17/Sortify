"use client";

import { Link2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";

export default function CreateLinkForm() {
  const [url, setUrl] = useState("");
  const [sortUrl, setSortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post("/api/shorten", {
        url,
        slug,
      });
      setSortUrl(data.data.shortUrl);
      toast.success("Link created");
      setUrl("");
      setLoading(false);
      router.refresh();
    } catch {
      toast.error("Failed to create link");
      setUrl("");
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <section className="glass-card section-shell">
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <span className="eyebrow">Create Link</span>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Turn any destination into a clean, trackable short URL
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Paste a long URL, add an optional custom slug, and publish a
                polished link that fits the rest of your workspace.
              </p>
            </div>
          </div>

          <div className="surface-muted flex items-center gap-3 px-4 py-3 text-sm text-slate-600">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-[0_14px_30px_rgba(79,70,229,0.24)]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Instant creation</p>
              <p className="text-xs text-slate-500">
                Refreshes the dashboard as soon as the link is generated.
              </p>
            </div>
          </div>
        </div>

        <div className="subtle-divider" />

        <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_auto]">
          <label className="space-y-2">
            <span className="field-label">Destination URL</span>
            <input
              className="field-input"
              type="text"
              placeholder="https://example.com/your-long-link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <span className="field-help">
              Use the full destination link you want your visitors to open.
            </span>
          </label>

          <label className="space-y-2">
            <span className="field-label">Custom slug</span>
            <input
              className="field-input"
              type="text"
              placeholder="optional-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <span className="field-help">
              Leave blank to generate a short random slug automatically.
            </span>
          </label>

          <div className="flex flex-col justify-end">
            <button
              className="primary-button w-full min-w-[180px]"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/80" />
                  <span>Creating...</span>
                </span>
              ) : (
                <>
                  <Link2 className="size-4" />
                  <span>Create short link</span>
                </>
              )}
            </button>
          </div>
        </form>

        {sortUrl && (
          <div className="surface-muted flex flex-col gap-3 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Latest short URL
              </p>
              <span className="status-badge w-fit">Ready to share</span>
            </div>
            <p className="break-all rounded-2xl border border-white/75 bg-white/72 px-4 py-3 font-mono text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:text-base">
              {sortUrl}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
