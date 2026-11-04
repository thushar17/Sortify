import Link from "next/link";

import { RANGES, type Range } from "@/lib/link-analytics";
import { cn } from "@/lib/utils";

export default function RangeTabs({ basePath, active }: { basePath: string; active: Range }) {
  return (
    <nav aria-label="Date range" className="inline-flex h-8 items-center rounded-md border bg-card p-0.5">
      {(Object.keys(RANGES) as Range[]).map((range) => (
        <Link
          key={range}
          href={range === "30d" ? basePath : `${basePath}?range=${range}`}
          scroll={false}
          aria-current={range === active ? "page" : undefined}
          className={cn(
            "inline-flex h-full items-center rounded-sm px-2.5 text-[13px] transition-colors",
            range === active
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {range === "all" ? "All" : range}
        </Link>
      ))}
    </nav>
  );
}
