"use client";

import { useState } from "react";

import CopyButton from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";

type Tab = { label: string; code: string; html: string };

export default function CodeTabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card", className)}>
      <div className="flex h-9 items-center justify-between border-b bg-muted/50 pl-1.5 pr-1.5">
        <div role="tablist" className="flex h-full items-center gap-0.5">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={cn(
                "h-6 rounded-sm px-2 text-xs transition-colors",
                index === active
                  ? "bg-card font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CopyButton value={current.code} />
      </div>
      <div role="tabpanel" className="code-html" dangerouslySetInnerHTML={{ __html: current.html }} />
    </div>
  );
}
