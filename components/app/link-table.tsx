"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  MoreHorizontal,
  QrCode,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import DeleteLinkDialog from "@/components/app/delete-link-dialog";
import EmptyState from "@/components/app/empty-state";
import QrDialog from "@/components/app/qr-dialog";
import Sparkline from "@/components/app/sparkline";
import StatusBadge, { getLinkStatus } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { DashboardLink } from "@/lib/dashboard";
import { formatDateTime, formatNumber, formatRelative, getShortUrl, splitUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

type StatusFilter = "all" | "active" | "expired" | "protected";
type SortKey = "created" | "clicks";

async function copyShortLink(slug: string) {
  await navigator.clipboard.writeText(getShortUrl(slug));
  toast.success(`Copied ${getShortUrl(slug).replace(/^https?:\/\//, "")}`);
}

function Favicon({ host }: { host: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      className="size-4 shrink-0 rounded-sm"
    />
  );
}

function Destination({ url }: { url: string }) {
  const { host, path } = splitUrl(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex min-w-0 items-center gap-2 hover:underline hover:decoration-border-strong hover:underline-offset-4"
      title={url}
    >
      <Favicon host={host} />
      <span className="truncate">
        <span className="text-foreground">{host}</span>
        <span className="text-muted-foreground">{path}</span>
      </span>
    </a>
  );
}

function SlugButton({ slug }: { slug: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => copyShortLink(slug)}
          className="group/slug inline-flex max-w-full items-center gap-1.5 font-mono text-[13px] font-medium text-foreground"
        >
          <span className="truncate">/{slug}</span>
          <Copy className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/slug:opacity-100 group-focus-visible/slug:opacity-100" />
        </button>
      </TooltipTrigger>
      <TooltipContent>Copy short link</TooltipContent>
    </Tooltip>
  );
}

type RowActionsProps = {
  link: DashboardLink;
  onQr: () => void;
  onDelete: () => void;
};

function RowActions({ link, onQr, onDelete }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for /${link.slug}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={() => copyShortLink(link.slug)}>
          <Copy />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onQr}>
          <QrCode />
          QR code
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${link.slug}`}>
            <BarChart3 />
            Analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={link.originalUrl} target="_blank" rel="noreferrer">
            <ExternalLink />
            Open destination
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SortHeader({
  label,
  active,
  direction,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  const Arrow = direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex items-center gap-1 hover:text-foreground", active && "text-foreground", className)}
    >
      {label}
      <Arrow className={cn("size-3", !active && "invisible")} />
    </button>
  );
}

export default function LinkTable({ links }: { links: DashboardLink[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "created",
    direction: "desc",
  });
  const [page, setPage] = useState(0);
  const [qrSlug, setQrSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<DashboardLink | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = links.filter((link) => {
      if (term && !link.slug.toLowerCase().includes(term) && !link.originalUrl.toLowerCase().includes(term)) {
        return false;
      }
      if (status === "protected") return link.hasPassword;
      if (status === "expired") return getLinkStatus(link.expiresAt) === "expired";
      if (status === "active") return getLinkStatus(link.expiresAt) !== "expired";
      return true;
    });

    const factor = sort.direction === "asc" ? 1 : -1;
    return result.sort((a, b) =>
      sort.key === "clicks"
        ? (a.totalClicks - b.totalClicks) * factor
        : (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * factor
    );
  }, [links, query, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
  }

  if (links.length === 0) {
    return (
      <div className="rounded-lg border bg-card">
        <EmptyState
          title="No links yet"
          description="Create your first short link and it will show up here with its clicks."
          action={
            <Button asChild>
              <Link href="/dashboard?new=1">Create a link</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center">
        <InputGroup className="h-8 sm:max-w-72">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Filter by slug or URL"
            aria-label="Filter links"
          />
        </InputGroup>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as StatusFilter);
            setPage(0);
          }}
        >
          <SelectTrigger size="sm" className="w-full sm:w-36" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All links</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="protected">Protected</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[13px] text-muted-foreground sm:ml-auto">
          {formatNumber(filtered.length)} {filtered.length === 1 ? "link" : "links"}
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No matching links" description="Try a different search or status filter." />
      ) : (
        <>
          <table className="hidden w-full table-fixed text-left text-sm md:table">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="w-[22%] px-4 py-2 font-medium">Short link</th>
                <th className="px-4 py-2 font-medium">Destination</th>
                <th className="w-36 px-4 py-2 text-right font-medium">
                  <SortHeader
                    label="Clicks"
                    active={sort.key === "clicks"}
                    direction={sort.direction}
                    onClick={() => toggleSort("clicks")}
                  />
                </th>
                <th className="w-32 px-4 py-2 font-medium">Status</th>
                <th className="w-32 px-4 py-2 font-medium">
                  <SortHeader
                    label="Created"
                    active={sort.key === "created"}
                    direction={sort.direction}
                    onClick={() => toggleSort("created")}
                  />
                </th>
                <th className="w-12 px-2 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((link) => (
                <tr key={link.id} className="border-b last:border-b-0 hover:bg-muted/50">
                  <td className="px-4 py-2.5">
                    <SlugButton slug={link.slug} />
                  </td>
                  <td className="px-4 py-2.5">
                    <Destination url={link.originalUrl} />
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/dashboard/${link.slug}`}
                      className="flex items-center justify-end gap-3 hover:text-primary"
                      aria-label={`${link.totalClicks} clicks, view analytics`}
                    >
                      <Sparkline values={link.dailyClicks} width={48} height={16} />
                      <span className="w-10 text-right font-mono tabular-nums">
                        {formatNumber(link.totalClicks)}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge expiresAt={link.expiresAt} hasPassword={link.hasPassword} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-[13px] text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span suppressHydrationWarning>{formatRelative(link.createdAt)}</span>
                      </TooltipTrigger>
                      <TooltipContent suppressHydrationWarning>{formatDateTime(link.createdAt)}</TooltipContent>
                    </Tooltip>
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <RowActions
                      link={link}
                      onQr={() => setQrSlug(link.slug)}
                      onDelete={() => setDeleting(link)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y md:hidden">
            {rows.map((link) => (
              <li key={link.id} className="flex items-start gap-3 px-3 py-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <SlugButton slug={link.slug} />
                  <div className="text-[13px]">
                    <Destination url={link.originalUrl} />
                  </div>
                  <div className="flex items-center gap-3 pt-0.5 text-xs text-muted-foreground">
                    <Link href={`/dashboard/${link.slug}`} className="font-mono tabular-nums hover:text-foreground">
                      {formatNumber(link.totalClicks)} clicks
                    </Link>
                    <StatusBadge expiresAt={link.expiresAt} hasPassword={link.hasPassword} className="text-xs" />
                    <span suppressHydrationWarning>{formatRelative(link.createdAt)}</span>
                  </div>
                </div>
                <RowActions
                  link={link}
                  onQr={() => setQrSlug(link.slug)}
                  onDelete={() => setDeleting(link)}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t px-3 py-2 text-[13px] text-muted-foreground">
          <span className="font-mono tabular-nums">
            {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <QrDialog
        slug={qrSlug}
        shortUrl={qrSlug ? getShortUrl(qrSlug) : ""}
        onOpenChange={(open) => !open && setQrSlug(null)}
      />
      <DeleteLinkDialog link={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </div>
  );
}
