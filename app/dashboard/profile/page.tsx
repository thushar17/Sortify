import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/app/page-header";
import SignOutButton from "@/components/app/sign-out-button";
import UserAvatar from "@/components/dashboard/UserAvatar";
import { getAuthenticatedDashboardContext } from "@/lib/dashboard";
import { formatNumber } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Profile",
};

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 px-4 py-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
      </div>
      <div className="min-w-0 text-sm">{children}</div>
    </div>
  );
}

export default async function ProfilePage() {
  const { session, user } = await getAuthenticatedDashboardContext();
  const [linkCount, clickCount] = await Promise.all([
    prisma.link.count({ where: { userId: user.id } }),
    prisma.click.count({ where: { link: { userId: user.id } } }),
  ]);

  const name = session.user?.name;
  const email = session.user?.email || user.email;

  return (
    <>
      <PageHeader title="Profile" description="Your account and usage." />

      <section className="divide-y rounded-lg border bg-card">
        <Row label="Account" description="Managed by your Google account.">
          <div className="flex items-center gap-3">
            <UserAvatar name={name} email={email} image={session.user?.image} className="size-10" />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{name || "—"}</p>
              <p className="truncate text-muted-foreground">{email}</p>
            </div>
          </div>
        </Row>
        <Row label="Usage">
          <dl className="flex gap-10">
            <div>
              <dt className="text-[13px] text-muted-foreground">Links</dt>
              <dd className="mt-0.5 font-mono text-lg tabular-nums">{formatNumber(linkCount)}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted-foreground">Clicks, all time</dt>
              <dd className="mt-0.5 font-mono text-lg tabular-nums">{formatNumber(clickCount)}</dd>
            </div>
          </dl>
        </Row>
        <Row label="API access">
          <div className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">
              {user.apiKeyHash ? (
                <>
                  Key <span className="font-mono text-foreground">sk_sortify_{user.apiKeyPrefix}…</span> is active.
                </>
              ) : (
                "No API key yet."
              )}
            </p>
            <Link href="/dashboard/api-keys" className="shrink-0 underline underline-offset-4">
              Manage
            </Link>
          </div>
        </Row>
        <Row label="Session" description="Sign out of Sortify on this device.">
          <SignOutButton />
        </Row>
      </section>
    </>
  );
}
