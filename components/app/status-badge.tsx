import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

const DAY = 24 * 60 * 60 * 1000;

export type LinkStatus = "active" | "expiring" | "expired";

export function getLinkStatus(expiresAt: Date | string | null, now = new Date()): LinkStatus {
  if (!expiresAt) return "active";
  const remaining = new Date(expiresAt).getTime() - now.getTime();
  if (remaining <= 0) return "expired";
  if (remaining < 3 * DAY) return "expiring";
  return "active";
}

function expiresInLabel(expiresAt: Date | string) {
  const hours = Math.max(1, Math.round((new Date(expiresAt).getTime() - Date.now()) / 3600000));
  return hours < 24 ? `Expires in ${hours}h` : `Expires in ${Math.round(hours / 24)}d`;
}

type Props = {
  expiresAt: Date | string | null;
  hasPassword?: boolean;
  className?: string;
};

export default function StatusBadge({ expiresAt, hasPassword, className }: Props) {
  const status = getLinkStatus(expiresAt);

  return (
    <span className={cn("inline-flex items-center gap-2 text-[13px]", className)}>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span
          className={cn(
            "size-1.5 rounded-full",
            status === "active" && "bg-success",
            status === "expiring" && "bg-warning",
            status === "expired" && "bg-border-strong"
          )}
        />
        <span className={cn(status === "expired" ? "text-muted-foreground" : "text-foreground")}>
          {status === "active" && "Active"}
          {status === "expired" && "Expired"}
          {status === "expiring" && expiresAt && expiresInLabel(expiresAt)}
        </span>
      </span>
      {hasPassword && (
        <Lock className="size-3 text-muted-foreground" aria-label="Password protected" />
      )}
    </span>
  );
}
