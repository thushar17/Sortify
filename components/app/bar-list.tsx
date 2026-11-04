"use client";

import { useState } from "react";

import { formatNumber } from "@/lib/format";

type Item = { label: string; value: number; prefix?: string };

const VISIBLE = 8;

export default function BarList({
  title,
  items,
  emptyLabel = "No clicks in this period.",
}: {
  title: string;
  items: Item[];
  emptyLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const max = items[0]?.value ?? 0;
  const visible = expanded ? items : items.slice(0, VISIBLE);

  return (
    <section className="rounded-lg border bg-card">
      <header className="flex items-center justify-between border-b px-4 py-2.5 text-xs text-muted-foreground">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <span>Clicks</span>
      </header>
      {items.length === 0 ? (
        <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-1 p-2">
          {visible.map((item) => {
            const share = total ? (item.value / total) * 100 : 0;
            return (
              <li key={item.label} className="relative flex h-8 items-center justify-between gap-3 px-2 text-[13px]">
                <span
                  className="absolute inset-y-0 left-0 rounded-sm bg-primary/10"
                  style={{ width: `${max ? (item.value / max) * 100 : 0}%` }}
                  aria-hidden="true"
                />
                <span className="relative flex min-w-0 items-center gap-2">
                  {item.prefix && <span aria-hidden="true">{item.prefix}</span>}
                  <span className="truncate text-foreground">{item.label}</span>
                </span>
                <span className="relative flex shrink-0 items-baseline gap-2 font-mono tabular-nums">
                  <span className="text-foreground">{formatNumber(item.value)}</span>
                  <span className="w-9 text-right text-xs text-muted-foreground">{Math.round(share)}%</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {items.length > VISIBLE && (
        <footer className="border-t px-4 py-2">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-[13px] text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Show less" : `Show all ${items.length}`}
          </button>
        </footer>
      )}
    </section>
  );
}
