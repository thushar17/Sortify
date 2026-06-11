"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  KeyRound,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { signOut } from "next-auth/react";

import UserAvatar from "@/components/dashboard/UserAvatar";

type Props = {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: UserRound, label: "Profile" },
  { href: "/dashboard/api-keys", icon: KeyRound, label: "API Keys" },
  { href: "/docs", icon: BookOpen, label: "Docs" },
];

export default function DashboardSidebar({
  userName,
  userEmail,
  userImage,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="glass-card flex h-full flex-col rounded-none border-y-0 border-l-0 lg:sticky lg:top-0 lg:h-screen lg:w-[224px]">
      <div className="flex h-16 items-center border-b border-[rgba(148,163,184,0.18)] px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl border border-white/80 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-sm font-semibold text-white shadow-[0_10px_22px_rgba(59,130,246,0.18)]">
            S
          </div>
          <div>
            <span className="block text-sm font-semibold tracking-tight text-[#0f172a]">
              Sortify
            </span>
            <span className="block text-[0.7rem] text-[#64748b]">
              Premium short links
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
            >
              <Icon className="size-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[rgba(148,163,184,0.18)] p-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-[rgba(255,255,255,0.55)] px-2.5 py-2">
          <UserAvatar
            name={userName}
            email={userEmail}
            image={userImage}
            className="size-8"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#0f172a]">
              {userName || "User"}
            </p>
            <p className="truncate text-[0.7rem] text-[#64748b]">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="sidebar-link mt-2 w-full justify-start text-[#64748b] hover:bg-[rgba(239,68,68,0.08)] hover:text-[#ef4444]"
        >
          <LogOut className="size-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
