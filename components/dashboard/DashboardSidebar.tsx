import { LayoutDashboard, UserRound } from "lucide-react";
import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";
import UserAvatar from "@/components/dashboard/UserAvatar";

type Props = {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

export default function DashboardSidebar({
  userName,
  userEmail,
  userImage,
}: Props) {
  return (
    <aside className="glass-card section-shell lg:sticky lg:top-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-semibold text-white shadow-[0_14px_30px_rgba(79,70,229,0.24)]">
            S
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-950">
              Sortify
            </p>
            <p className="text-sm text-slate-500">Authenticated workspace</p>
          </div>
        </div>

        <div className="subtle-divider" />

        <div className="surface-muted flex items-center gap-3 px-4 py-4">
          <UserAvatar name={userName} email={userEmail} image={userImage} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">
              {userName || "Authenticated user"}
            </p>
            <p className="truncate text-sm text-slate-500">{userEmail}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="secondary-button w-full justify-start">
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="secondary-button w-full justify-start"
          >
            <UserRound className="size-4" />
            <span>Profile</span>
          </Link>
          <LogoutButton className="w-full justify-start" />
        </nav>
      </div>
    </aside>
  );
}
