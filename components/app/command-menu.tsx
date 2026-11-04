"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Plus, Search } from "lucide-react";

import { accountNav, primaryNav } from "@/components/app/nav";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export type CommandLink = {
  slug: string;
  originalUrl: string;
};

function getHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function CommandMenu({ links }: { links: CommandLink[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 w-60 items-center gap-2 rounded-md border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:border-border-strong md:flex"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search links…</span>
        <kbd className="rounded border bg-muted px-1.5 font-mono text-[11px]">⌘K</kbd>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search links or jump to a page"
      >
        <CommandInput placeholder="Search links or jump to…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => go("/dashboard?new=1")}>
              <Plus />
              New link
              <CommandShortcut>N</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          {links.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Links">
                {links.map((link) => (
                  <CommandItem
                    key={link.slug}
                    value={`${link.slug} ${link.originalUrl}`}
                    onSelect={() => go(`/dashboard/${link.slug}`)}
                  >
                    <Link2 />
                    <span className="font-mono">/{link.slug}</span>
                    <span className="truncate text-muted-foreground">{getHost(link.originalUrl)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          <CommandGroup heading="Go to">
            {[...primaryNav, ...accountNav].map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem key={item.href} onSelect={() => go(item.href)}>
                  <Icon />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
