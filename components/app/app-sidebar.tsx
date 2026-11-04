"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ChevronsUpDown, LogOut } from "lucide-react";

import { Logo } from "@/components/app/logo";
import { accountNav, isNavActive, primaryNav } from "@/components/app/nav";
import UserAvatar from "@/components/dashboard/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {primaryNav.map((item) => {
        const Icon = item.icon;
        const active = isNavActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function UserMenu({ user }: { user: SidebarUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-muted data-[state=open]:bg-muted">
        <UserAvatar name={user.name} email={user.email} image={user.image} className="size-7" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {user.name || "Account"}
          </span>
          <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-52">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountNav.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                <Icon />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/" })}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AppSidebar({ user }: { user: SidebarUser }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-58 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex h-13 items-center px-4">
        <Logo href="/dashboard" />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <SidebarNav />
      </div>
      <div className="border-t p-2">
        <UserMenu user={user} />
      </div>
    </aside>
  );
}
