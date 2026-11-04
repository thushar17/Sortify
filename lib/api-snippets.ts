import type { Snippet } from "@/components/docs/code-block";

export const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sortify-url.vercel.app";
export const EXAMPLE_KEY = "sk_sortify_your_key";

export function requestSnippets({
  method,
  path,
  body,
}: {
  method: "GET" | "POST" | "DELETE";
  path: string;
  body?: Record<string, string>;
}): Snippet[] {
  const url = `${API_BASE_URL}${path}`;
  const json = body ? JSON.stringify(body, null, 2) : null;

  const curl = [
    `curl${method === "GET" ? "" : ` -X ${method}`} ${url} \\`,
    `  -H "x-api-key: ${EXAMPLE_KEY}"${json ? " \\" : ""}`,
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
