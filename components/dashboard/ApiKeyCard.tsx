"use client";

import { api } from "@/lib/api";
import { Check, Copy, Eye, EyeOff, RefreshCw, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ApiKeyCard() {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/api/api-key-status")
      .then(({ data }) => {
        if (!cancelled) {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function generateKey() {
    try {
      setLoading(true);
      const { data } = await api.post("/api/create-api-key");
      setApiKey(data.apiKey);
      setShowKey(true);
      setHasApiKey(true);
      toast.success("API key generated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate API key");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.36)] px-5 py-4">
        <div className="flex size-8 items-center justify-center rounded-xl border border-white/80 bg-[rgba(255,255,255,0.7)] shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
          <Terminal className="size-4 text-[#020617]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0f172a]">API Key</p>
          <p className="text-xs text-[#64748b]">
            Programmatic access to Sortify
          </p>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              hasApiKey
                ? "border border-[rgba(34,197,94,0.16)] bg-[rgba(34,197,94,0.08)] text-[#16a34a]"
                : "border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.56)] text-[#64748b]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                hasApiKey ? "bg-[#22c55e]" : "bg-[#64748b]"
              }`}
            />
            {hasApiKey ? "Active" : "Not generated"}
          </span>
        </div>
      </div>

      <div className="p-5">
        {showKey && apiKey ? (
          <div className="mb-5 overflow-hidden rounded-2xl border border-[rgba(245,158,11,0.22)] bg-[rgba(255,251,235,0.72)]">
            <div className="flex items-center gap-2 border-b border-[rgba(245,158,11,0.16)] bg-[rgba(255,247,214,0.75)] px-4 py-2.5">
              <span className="text-xs font-medium text-[#b45309]">
                ⚠ Save this key now — it won&apos;t be shown again.
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <code className="flex-1 break-all font-mono text-sm text-[#0f172a]">
                {showKey ? apiKey : apiKey.replace(/./g, "•")}
              </code>
              <div className="flex flex-shrink-0 gap-1.5">
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="action-button"
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="action-button"
                  title="Copy key"
                >
                  {copied ? (
                    <Check className="size-4 text-[#22c55e]" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-5 flex h-12 items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.78)] bg-[rgba(255,255,255,0.5)] px-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
            <code className="font-mono text-sm text-[#64748b]">
              sk_sortify_••••••••••••••••••••••••
            </code>
          </div>
        )}

        <button
          id="generate-api-key-button"
          onClick={generateKey}
          disabled={loading}
          className="primary-button w-full justify-center"
        >
          {loading ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              Generating...
            </>
          ) : hasApiKey ? (
            <>
              <RefreshCw className="size-4" />
              Regenerate API Key
            </>
          ) : (
            <>
              <Terminal className="size-4" />
              Generate API Key
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-[#64748b]">
          Regenerating a key will immediately revoke the previous one. All
          existing integrations using the old key will stop working.
        </p>
      </div>
    </div>
  );
}
