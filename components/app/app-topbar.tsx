"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";

import { SidebarNav, UserMenu, type SidebarUser } from "@/components/app/app-sidebar";
import CommandMenu, { type CommandLink } from "@/components/app/command-menu";
import { Logo } from "@/components/app/logo";
import { getBreadcrumb } from "@/components/app/nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Props = {
  user: SidebarUser;
  links: CommandLink[];
};

export default function AppTopbar({ user, links }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const crumbs = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-13 shrink-0 items-center gap-3 border-b bg-background/95 px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="-ml-1.5 lg:hidden"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </Button>

      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            {index > 0 && <span className="text-border-strong">/</span>}
            {"href" in crumb && crumb.href ? (
              <Link href={crumb.href} className="text-muted-foreground hover:text-foreground">
                {crumb.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "truncate font-medium text-foreground",
                  "mono" in crumb && crumb.mono && "font-mono"
                )}
              >
                {crumb.label}
              </span>
            )}
          </Fragment>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <CommandMenu links={links} />
        <Button size="sm" asChild>
          <Link href="/dashboard?new=1">
            <Plus />
            <span className="hidden sm:inline">New link</span>
          </Link>
        </Button>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="flex w-64 flex-col gap-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-13 items-center px-4">
            <Logo href="/dashboard" />
          </div>
          <div className="flex-1 px-2 py-2">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
          <div className="border-t p-2">
            <UserMenu user={user} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
