import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock, CodeGroup, type Snippet } from "@/components/docs/code-block";
import SiteHeader from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "API reference",
  description: "Create, list, analyze, and delete Sortify short links over HTTP.",
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sortify-url.vercel.app";
const KEY = "sk_sortify_your_key";

const nav = [
  {
    title: "Getting started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "authentication", label: "Authentication" },
    ],
  },
  {
    title: "Endpoints",
    items: [
      { id: "create-link", label: "Create a link", method: "POST" },
      { id: "list-links", label: "List links", method: "GET" },
      { id: "link-analytics", label: "Link analytics", method: "GET" },
      { id: "delete-link", label: "Delete a link", method: "DEL" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "errors", label: "Errors" },
      { id: "rate-limits", label: "Rate limits" },
    ],
  },
];

function requestSnippets({
  method,
  path,
  body,
}: {
  method: "GET" | "POST" | "DELETE";
  path: string;
  body?: Record<string, string>;
}): Snippet[] {
  const url = `${BASE_URL}${path}`;
  const json = body ? JSON.stringify(body, null, 2) : null;

  const curl = [
    `curl${method === "GET" ? "" : ` -X ${method}`} ${url} \\`,
    `  -H "x-api-key: ${KEY}"${json ? " \\" : ""}`,
    ...(json ? [`  -H "Content-Type: application/json" \\`, `  -d '${json.replace(/\n/g, "\n  ")}'`] : []),
  ].join("\n");

  const js = [
    `const res = await fetch("${url}", {`,
    ...(method === "GET" ? [] : [`  method: "${method}",`]),
    `  headers: {`,
    `    "x-api-key": process.env.SORTIFY_API_KEY,`,
    ...(json ? [`    "Content-Type": "application/json",`] : []),
    `  },`,
    ...(json ? [`  body: JSON.stringify(${json.replace(/\n/g, "\n  ")}),`] : []),
    `});`,
    ``,
    `const data = await res.json();`,
  ].join("\n");

  const python = [
    `import os, requests`,
    ``,
    `res = requests.${method.toLowerCase()}(`,
    `    "${url}",`,
    `    headers={"x-api-key": os.environ["SORTIFY_API_KEY"]},`,
    ...(json ? [`    json=${json.replace(/\n/g, "\n    ")},`] : []),
    `)`,
    `data = res.json()`,
  ].join("\n");

  return [
    { label: "cURL", lang: "bash", code: curl },
    { label: "JavaScript", lang: "javascript", code: js },
    { label: "Python", lang: "python", code: python },
  ];
}

function Endpoint({ method, path }: { method: string; path: string }) {
  return (
    <p className="mt-2 inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 font-mono text-[13px]">
      <span className="font-medium text-foreground">{method}</span>
      <span className="text-muted-foreground">{path}</span>
    </p>
  );
}

function Params({ rows }: { rows: { name: string; type: string; required?: boolean; description: React.ReactNode }[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-foreground">Body parameters</h3>
      <dl className="mt-2 divide-y border-y">
        {rows.map((row) => (
          <div key={row.name} className="py-3">
            <dt className="flex items-baseline gap-2">
              <code className="font-mono text-[13px] font-medium text-foreground">{row.name}</code>
              <span className="font-mono text-xs text-muted-foreground">{row.type}</span>
              {row.required && <span className="text-xs text-warning">required</span>}
            </dt>
            <dd className="mt-1 text-sm text-muted-foreground">{row.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Section({
  id,
  title,
  children,
  code,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  code?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t py-10 first:border-t-0 first:pt-0">
      <div className="grid gap-6 xl:grid-cols-2 xl:gap-10">
        <div className="min-w-0 max-w-prose">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          <div className="mt-2 space-y-3 text-sm leading-6 text-muted-foreground [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground">
            {children}
          </div>
        </div>
        {code && <div className="min-w-0 space-y-3 xl:sticky xl:top-20 xl:self-start">{code}</div>}
      </div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader wide />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-6 text-sm">
            {nav.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-xs font-medium text-foreground">{group.title}</p>
                <ul className="space-y-0.5 border-l">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="-ml-px flex items-center justify-between border-l border-transparent py-1 pl-3 text-muted-foreground hover:border-border-strong hover:text-foreground"
                      >
                        {item.label}
                        {"method" in item && (
                          <span className="font-mono text-[10px] text-muted-foreground">{item.method}</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Section
            id="introduction"
            title="API reference"
            code={<CodeBlock title="Base URL" lang="text" code={BASE_URL} />}
          >
            <p>
              The Sortify API lets you create short links, list them, read their click data, and delete
              them from your own code. Requests and responses are JSON over HTTPS.
            </p>
            <p>
              Everything here uses the same account as the dashboard. Links created through the API show
              up in your dashboard, and the other way around.
            </p>
          </Section>

          <Section
            id="authentication"
            title="Authentication"
            code={<CodeBlock title="Header" lang="http" code={`x-api-key: ${KEY}`} />}
          >
            <p>
              Send your API key in the <code>x-api-key</code> header on every request. Create one on the{" "}
              <Link href="/dashboard/api-keys" className="text-foreground underline underline-offset-4">
                API keys
              </Link>{" "}
              page.
            </p>
            <p>
              Each account has one key. It&apos;s shown once when you create it; after that only its first
              characters are visible. Generating a new key revokes the old one immediately.
            </p>
            <p>
              Requests without a valid key get a <code>401</code>. Keep keys on your server and out of
              browser code.
            </p>
          </Section>

          <Section
            id="create-link"
            title="Create a link"
            code={
              <>
                <CodeGroup
                  snippets={requestSnippets({
                    method: "POST",
                    path: "/api/v1/links",
                    body: { url: "https://example.com/launch-notes", slug: "launch" },
                  })}
                />
                <CodeBlock
                  title="Response · 200"
                  lang="json"
                  code={JSON.stringify({ success: true, shortUrl: `${BASE_URL}/launch` }, null, 2)}
                />
              </>
            }
          >
            <Endpoint method="POST" path="/api/v1/links" />
            <p>Creates a short link and returns its full URL.</p>
            <Params
              rows={[
                {
                  name: "url",
                  type: "string",
                  required: true,
                  description: "The destination. Must be a full URL including https://.",
                },
                {
                  name: "slug",
                  type: "string",
                  description:
                    "Custom path for the short link. 3–30 characters: letters, numbers, - and _. Omit it for a random 6-character slug.",
                },
              ]}
            />
            <p className="pt-2">
              Expiry dates and passwords can be set from the dashboard; the API ignores them for now.
            </p>
          </Section>

          <Section
            id="list-links"
            title="List links"
            code={
              <>
                <CodeGroup snippets={requestSnippets({ method: "GET", path: "/api/v1/links" })} />
                <CodeBlock
                  title="Response · 200"
                  lang="json"
                  code={JSON.stringify(
                    {
                      links: [
                        {
                          id: "cm3k2x9ab0001",
                          slug: "launch",
                          originalUrl: "https://example.com/launch-notes",
                          click: 42,
                          createdAt: "2026-11-02T09:30:00.000Z",
                        },
                      ],
                    },
                    null,
                    2
                  )}
                />
              </>
            }
          >
            <Endpoint method="GET" path="/api/v1/links" />
            <p>Returns every link on your account, newest first.</p>
            <p>
              Each link includes <code>click</code>, the total number of recorded clicks.
            </p>
          </Section>

          <Section
            id="link-analytics"
            title="Link analytics"
            code={
              <>
                <CodeGroup snippets={requestSnippets({ method: "GET", path: "/api/v1/analytics/launch" })} />
                <CodeBlock
                  title="Response · 200"
                  lang="json"
                  code={JSON.stringify(
                    {
                      slug: "launch",
                      originalUrl: "https://example.com/launch-notes",
                      totalClicks: 2,
                      clicks: [
                        {
                          id: "cm3k3a1cd0004",
                          linkId: "cm3k2x9ab0001",
                          browser: "Chrome",
                          device: "Desktop",
                          country: "India",
                          createdAt: "2026-11-03T14:12:08.000Z",
                        },
                        {
                          id: "cm3k3b7ef0007",
                          linkId: "cm3k2x9ab0001",
                          browser: "Safari",
                          device: "Mobile",
                          country: "Germany",
                          createdAt: "2026-11-03T16:40:51.000Z",
                        },
                      ],
                    },
                    null,
                    2
                  )}
                />
              </>
            }
          >
            <Endpoint method="GET" path="/api/v1/analytics/:slug" />
            <p>
              Returns every recorded click for one of your links, with the browser, device type, and country
              of each visit.
            </p>
            <p>
              Returns <code>404</code> if the slug doesn&apos;t exist or belongs to another account.
            </p>
          </Section>

          <Section
            id="delete-link"
            title="Delete a link"
            code={
              <>
                <CodeGroup snippets={requestSnippets({ method: "DELETE", path: "/api/v1/links/launch" })} />
                <CodeBlock title="Response · 200" lang="json" code={JSON.stringify({ success: true }, null, 2)} />
              </>
            }
          >
            <Endpoint method="DELETE" path="/api/v1/links/:slug" />
            <p>
              Deletes the link and its click history. The short URL stops working immediately. This can&apos;t
              be undone.
            </p>
          </Section>

          <Section
            id="errors"
            title="Errors"
            code={<CodeBlock title="Error body" lang="json" code={JSON.stringify({ error: "Slug already exists" }, null, 2)} />}
          >
            <p>
              Errors use standard HTTP status codes and a JSON body with an <code>error</code> message.
            </p>
            <dl className="divide-y border-y">
              {[
                ["400", "The body failed validation, or the slug is already taken."],
                ["401", "The API key is missing or invalid."],
                ["404", "No link with that slug on your account."],
                ["429", "Rate limit reached. See below."],
              ].map(([status, text]) => (
                <div key={status} className="flex gap-4 py-2.5">
                  <dt className="w-10 shrink-0 font-mono text-[13px] text-foreground">{status}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="rate-limits" title="Rate limits">
            <p>
              Creating links is limited to 100 requests per hour per API key. Past that, requests return{" "}
              <code>429</code> with <code>{`{"error": "Hourly limit exceeded"}`}</code> until the hour resets.
            </p>
            <p>Listing, analytics, and delete requests aren&apos;t rate limited.</p>
          </Section>
        </main>
      </div>
    </div>
  );
}
