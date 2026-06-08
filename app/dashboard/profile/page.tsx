import { Link2, Mail, MousePointerClick, UserRound } from "lucide-react";

import DashboardTopNav from "@/components/dashboard/DashboardTopNav";
import UserAvatar from "@/components/dashboard/UserAvatar";
import {
  formatDashboardLinks,
  getAuthenticatedDashboardContext,
  getLinkMetrics,
  getUserLinksWithClicks,
} from "@/lib/dashboard";

export default async function ProfilePage() {
  const { session, user } = await getAuthenticatedDashboardContext();
  const dbLinks = await getUserLinksWithClicks(user.id);
  const links = formatDashboardLinks(dbLinks);
  const { totalLinks, totalClicks } = getLinkMetrics(links);

  const displayName = session.user?.name || "Authenticated user";
  const displayEmail = session.user?.email || user.email;

  return (
    <>
      <DashboardTopNav
        title="Profile"
        description="Review your authenticated workspace details and high-level link performance summary."
        userName={session.user?.name}
        userEmail={session.user?.email}
        userImage={session.user?.image}
      />

      <section className="glass-card section-shell">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={session.user?.name}
                email={displayEmail}
                image={session.user?.image}
                className="size-16 rounded-[1.5rem] text-lg"
              />
              <div className="space-y-2">
                <span className="eyebrow">Profile</span>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {displayName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 sm:text-base">
                    {displayEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-muted flex items-center gap-3 px-4 py-3 text-sm text-slate-600">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-[0_14px_30px_rgba(79,70,229,0.24)]">
                <UserRound className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Account overview</p>
                <p className="text-xs text-slate-500">
                  Authenticated via your existing Google session.
                </p>
              </div>
            </div>
          </div>

          <div className="subtle-divider" />

          <div className="grid gap-4 xl:grid-cols-2">
            <article className="metric-card">
              <div className="relative flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-500">
                    Total links
                  </p>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
                    {totalLinks}
                  </p>
                  <p className="max-w-xs text-sm leading-6 text-slate-600">
                    Short URLs currently managed by this authenticated account.
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-blue-700 shadow-[0_14px_30px_rgba(59,130,246,0.12)]">
                  <Link2 className="size-5" />
                </div>
              </div>
            </article>

            <article className="metric-card">
              <div className="relative flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-500">
                    Total clicks
                  </p>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">
                    {totalClicks}
                  </p>
                  <p className="max-w-xs text-sm leading-6 text-slate-600">
                    All recorded engagement generated across your short links.
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-blue-700 shadow-[0_14px_30px_rgba(59,130,246,0.12)]">
                  <MousePointerClick className="size-5" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="glass-card section-shell">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <span className="eyebrow">Account Details</span>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Existing authenticated user information
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              This page uses your current session details and existing link
              records to present a dedicated profile view.
            </p>
          </div>

          <div className="subtle-divider" />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Name
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">
                {displayName}
              </p>
            </div>

            <div className="surface-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Email
              </p>
              <p className="mt-3 inline-flex items-center gap-2 break-all text-lg font-semibold text-slate-950">
                <Mail className="size-4 text-blue-600" />
                {displayEmail}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
