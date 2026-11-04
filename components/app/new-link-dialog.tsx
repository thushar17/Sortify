"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { CalendarIcon, Check, ChevronRight, Copy, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { getShortHost, normalizeUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

const SLUG_PATTERN = /^[a-zA-Z0-9-_]+$/;

function validateSlug(slug: string) {
  if (!slug) return null;
  if (!SLUG_PATTERN.test(slug)) return "Use letters, numbers, - and _ only.";
  if (slug.length < 3) return "At least 3 characters.";
  if (slug.length > 30) return "30 characters at most.";
  return null;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function NewLinkForm({ defaultUrl, onDone }: { defaultUrl: string; onDone: () => void }) {
  const router = useRouter();
  const [url, setUrl] = useState(defaultUrl);
  const [slug, setSlug] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [expiryTime, setExpiryTime] = useState("23:59");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const slugError = validateSlug(slug.trim());
  const shortHost = getShortHost();

  function getExpiresAt() {
    if (!expiryDate) return "";
    const [hours, minutes] = expiryTime.split(":").map(Number);
    const date = new Date(expiryDate);
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date.toISOString();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (slugError) return;
    setPending(true);
    setError(null);

    try {
      const { data } = await api.post("/api/shorten", {
        url: normalizeUrl(url),
        slug: slug.trim(),
        expiresAt: getExpiresAt(),
        password,
      });
      setCreated(data.shortUrl);
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError("You've hit the hourly limit for new links. Try again later.");
        } else {
          setError(err.response?.data?.error ?? "Couldn't create the link. Try again.");
        }
      } else {
        setError("Couldn't create the link. Try again.");
      }
    } finally {
      setPending(false);
    }
  }

  async function copyCreated() {
    if (!created) return;
    await navigator.clipboard.writeText(created);
    setCopied(true);
    toast.success("Copied to clipboard");
  }

  if (created) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Link created</DialogTitle>
          <DialogDescription>It&apos;s live now. Share it anywhere.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-md border bg-muted py-1 pl-3 pr-1">
          <span className="min-w-0 flex-1 truncate font-mono text-sm">{created}</span>
          <Button size="sm" variant="outline" onClick={copyCreated}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setCreated(null);
              setCopied(false);
              setUrl("");
              setSlug("");
              setPassword("");
              setExpiryDate(undefined);
            }}
          >
            Create another
          </Button>
          <Button onClick={onDone}>Done</Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>New link</DialogTitle>
        <DialogDescription>Paste a long URL to get a short one.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-1.5">
        <Label htmlFor="new-link-url">Destination</Label>
        <Input
          id="new-link-url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/a/very/long/path"
          autoComplete="off"
          autoFocus
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="new-link-slug">Short link</Label>
        <InputGroup>
          <InputGroupAddon className="pr-0 font-mono font-normal">{shortHost}/</InputGroupAddon>
          <InputGroupInput
            id="new-link-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="random"
            className="pl-0! font-mono"
            aria-invalid={Boolean(slugError)}
            autoComplete="off"
          />
        </InputGroup>
        <p className={cn("text-xs", slugError ? "text-destructive" : "text-muted-foreground")}>
          {slugError ?? "Leave empty for a random 6-character slug."}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((value) => !value)}
          className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
          aria-expanded={showAdvanced}
        >
          <ChevronRight className={cn("size-3.5 transition-transform", showAdvanced && "rotate-90")} />
          Expiry and password
          {!showAdvanced && (expiryDate || password) && (
            <span className="ml-1 text-foreground">· set</span>
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid gap-4 rounded-md border bg-muted/50 p-3">
            <div className="grid gap-1.5">
              <Label>Expires</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("flex-1 justify-start font-normal", !expiryDate && "text-muted-foreground")}
                    >
                      <CalendarIcon />
                      {expiryDate
                        ? expiryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Never"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={expiryTime}
                  onChange={(event) => setExpiryTime(event.target.value)}
                  disabled={!expiryDate}
                  className="w-28 font-mono"
                  aria-label="Expiry time"
                />
                {expiryDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpiryDate(undefined)}
                    aria-label="Clear expiry"
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="new-link-password">Password</Label>
              <Input
                id="new-link-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="None"
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                Visitors enter it before they&apos;re redirected.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive">
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending || !url.trim() || Boolean(slugError)}>
          {pending ? "Creating…" : "Create link"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function NewLinkDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const open = searchParams.has("new");
  const defaultUrl = searchParams.get("url") ?? "";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() === "n" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(event.target) &&
        !document.querySelector("[role=dialog]")
      ) {
        event.preventDefault();
        router.replace(`${pathname}?new=1`, { scroll: false });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pathname, router]);

  function close() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="sm:max-w-md">
        {open && <NewLinkForm key={defaultUrl} defaultUrl={defaultUrl} onDone={close} />}
      </DialogContent>
    </Dialog>
  );
}
