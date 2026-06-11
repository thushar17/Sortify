import Link from "next/link";

import ApiKeyCard from "@/components/dashboard/ApiKeyCard";

export default function ApiKeysPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#0f172a]">
          API Keys
        </h1>
        <p className="text-sm text-[#475569]">
          Generate and manage your API keys for programmatic access.
        </p>
      </div>

      <ApiKeyCard />

      <div className="glass-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#0f172a]">
          How to use your API key
        </h2>
        <p className="mb-3 text-sm text-[#475569]">
          Include the key in every request using the{" "}
          <code className="rounded border border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.7)] px-1.5 py-0.5 font-mono text-xs text-[#4f46e5]">
            x-api-key
          </code>{" "}
          header.
        </p>
        <pre className="code-block text-sm">
          {`curl -X POST https://your-domain.com/api/v1/links \\
  -H "x-api-key: sk_sortify_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
        </pre>
        <p className="mt-3 text-xs text-[#64748b]">
          See the{" "}
          <Link href="/docs" className="text-[#4f46e5] hover:underline">
            full API documentation
          </Link>{" "}
          for all available endpoints.
        </p>
      </div>
    </div>
  );
}
