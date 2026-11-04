import type { Metadata } from "next";
import Link from "next/link";

import ApiKeyManager from "@/components/app/api-key-manager";
import PageHeader from "@/components/app/page-header";
import { CodeBlock } from "@/components/docs/code-block";
import { getAuthenticatedDashboardContext } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "API keys",
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sortify-url.vercel.app";

export default async function ApiKeysPage() {
  const { user } = await getAuthenticatedDashboardContext();

  return (
    <>
      <PageHeader title="API keys" description="Create and manage links from your own code." />

      <section className="rounded-lg border bg-card">
        <header className="border-b px-4 py-3">
          <h2 className="text-sm font-medium">Secret key</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            One key per account. Regenerating it revokes the old one.
          </p>
        </header>
        <ApiKeyManager prefix={user.apiKeyHash ? user.apiKeyPrefix : null} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
        <div>
          <h2 className="text-sm font-medium">Quick start</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Send the key in the <code className="font-mono text-[13px] text-foreground">x-api-key</code> header.
            This request creates a short link and returns its URL.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/docs" className="underline underline-offset-4">
              Read the API reference
            </Link>
          </p>
        </div>
        <CodeBlock
          title="cURL"
          lang="bash"
          code={`curl -X POST ${BASE_URL}/api/v1/links \\
  -H "x-api-key: $SORTIFY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
        />
      </section>
    </>
  );
}
