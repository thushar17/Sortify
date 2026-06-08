import Link from "next/link";

import UserAvatar from "@/components/dashboard/UserAvatar";

type Props = {
  title: string;
  description: string;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

export default function DashboardTopNav({
  title,
  description,
  userName,
  userEmail,
  userImage,
}: Props) {
  return (
    <section className="glass-card section-shell">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-semibold text-white shadow-[0_14px_30px_rgba(79,70,229,0.24)]">
              S
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-950">
                Sortify
              </p>
              <p className="text-sm text-slate-500">Link operations platform</p>
            </div>
          </Link>

          <div className="subtle-divider sm:hidden" />

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Current page
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <div className="surface-muted flex items-center gap-3 px-4 py-3">
          <UserAvatar name={userName} email={userEmail} image={userImage} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">
              {userName || "Authenticated user"}
            </p>
            <p className="truncate text-sm text-slate-500">{userEmail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
