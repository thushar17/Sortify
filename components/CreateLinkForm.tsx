"use client";
import { Link2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import axios from "axios";

import { api } from "@/lib/api";

export default function CreateLinkForm() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [password, setPassword] = useState("");
  const [sortUrl, setSortUrl] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post("/api/shorten", {
        url,
        slug,
        expiresAt,
        password,
      });
      setSortUrl(data.data.shortUrl);
      toast.success("Link created");
      setUrl("");
      setSlug("");
      setExpiresAt("");
      setPassword("");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        toast.error("You have reached the hourly link creation limit.");
        return;
      }
      toast.error("Failed to create link");
      setUrl("");
      setSlug("");
      setExpiresAt("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.18)] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#0f172a]">New link</p>
          <p className="text-xs text-[#64748b]">
            Create a short link with optional expiry and password protection.
          </p>
        </div>
        <button
          id="toggle-create-link"
          onClick={() => {
            setOpen((v) => !v);
            setSortUrl("");
          }}
          className="secondary-button h-8 px-3 text-xs text-[#4f46e5]"
        >
          {open ? (
            <>
              <X className="size-3" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="size-3" />
              Create link
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.34)] px-4 py-4">
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="field-label">Destination URL *</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="https://example.com/very-long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="field-label">Custom slug</label>
                <input
                  className="field-input font-mono"
                  type="text"
                  placeholder="my-link"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="space-y-1.5">
                  <label className="field-label">Expires at</label>
                  <input
                    className="field-input"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="field-label">Password</label>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Optional"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="primary-button w-full whitespace-nowrap"
                type="submit"
                disabled={loading || !url}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white/80" />
                    Creating...
                  </span>
                ) : (
                  <>
                    <Link2 className="size-3.5" />
                    Shorten
                  </>
                )}
              </button>
            </div>
          </form>

          {sortUrl && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[rgba(59,130,246,0.18)] bg-[rgba(255,255,255,0.58)] px-4 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f46e5]">
                  Your short link
                </p>
                <p className="truncate font-mono text-sm text-[#0f172a]">
                  {sortUrl}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sortUrl);
                  toast.success("Copied to clipboard");
                }}
                className="secondary-button h-8 px-3 text-xs"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
