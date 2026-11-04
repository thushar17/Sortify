import { codeToHtml, type BundledLanguage, type SpecialLanguage } from "shiki";

import CodeTabs from "@/components/docs/code-tabs";
import CopyButton from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";

export type Snippet = { label: string; lang: BundledLanguage | SpecialLanguage; code: string };

export function highlight(code: string, lang: BundledLanguage | SpecialLanguage) {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}

export async function CodeBlock({
  title,
  code,
  lang,
  className,
}: {
  title?: string;
  code: string;
  lang: BundledLanguage | SpecialLanguage;
  className?: string;
}) {
  const html = await highlight(code, lang);

  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card", className)}>
      <div className="flex h-9 items-center justify-between border-b bg-muted/50 pl-3 pr-1.5">
        <span className="text-xs text-muted-foreground">{title}</span>
        <CopyButton value={code} />
      </div>
      <div className="code-html" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export async function CodeGroup({ snippets, className }: { snippets: Snippet[]; className?: string }) {
  const tabs = await Promise.all(
    snippets.map(async (snippet) => ({
      label: snippet.label,
      code: snippet.code,
      html: await highlight(snippet.code, snippet.lang),
    }))
  );

  return <CodeTabs tabs={tabs} className={className} />;
}
