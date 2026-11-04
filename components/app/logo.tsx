import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("size-4 text-primary", className)}
    >
      <rect x="1" y="4" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.35" />
      <rect x="1" y="9.5" width="6" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <LogoMark />
      sortify
    </Link>
  );
}
