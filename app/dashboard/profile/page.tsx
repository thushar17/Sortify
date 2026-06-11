import { KeyRound, Mail } from "lucide-react";
import Link from "next/link";

import UserAvatar from "@/components/dashboard/UserAvatar";
import {
  getAuthenticatedDashboardContext,
  getUserLinksWithClicks,
  formatDashboardLinks,
  getLinkMetrics,
} from "@/lib/dashboard";

export default async function ProfilePage() {
  const { session, user } = await getAuthenticatedDashboardContext();
  const dbLinks = await getUserLinksWithClicks(user.id);
  const links = formatDashboardLinks(dbLinks);
  const { totalLinks, totalClicks } = getLinkMetrics(links);

  const displayName = session.user?.name || "User";
  const displayEmail = session.user?.email || user.email;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#0f172a]">
          Profile
        </h1>
        <p className="text-sm text-[#475569]">
          Your account information and workspace stats.
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
          <UserAvatar
            name={session.user?.name}
            email={displayEmail}
            image={session.user?.image}
            className="h-16 w-16 flex-shrink-0 rounded-xl text-lg shadow-sm"
          />

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#0f172a]">
              {displayName}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.78)] bg-[rgba(255,255,255,0.6)] px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                <Mail className="size-4 flex-shrink-0 text-[#64748b]" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#64748b]">Email</p>
                  <p className="truncate text-sm font-medium text-[#0f172a]">
                    {displayEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[rgba(148,163,184,0.18)] pt-6">
          <div>
            <p className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#0f172a]">
              {totalLinks}
            </p>
            <p className="mt-1 text-sm font-medium text-[#475569]">Total links</p>
          </div>
          <div>
            <p className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#0f172a]">
              {totalClicks}
            </p>
            <p className="mt-1 text-sm font-medium text-[#475569]">Total clicks</p>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/api-keys"
        className="group glass-card flex items-center justify-between p-6 transition-colors hover:bg-[rgba(255,255,255,0.9)]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(59,130,246,0.1)]">
            <KeyRound className="size-5 text-[#3b82f6]" />
          </div>
          <div>
            <p className="text-base font-semibold text-[#0f172a]">API Keys</p>
            <p className="text-sm text-[#475569]">
              Manage programmatic access to Sortify
            </p>
          </div>
        </div>
        <div className="text-[#64748b] transition-transform group-hover:translate-x-1">
          →
        </div>
      </Link>
    </div>
  );
}
