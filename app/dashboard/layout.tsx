import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getAuthenticatedDashboardContext } from "@/lib/dashboard";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = await getAuthenticatedDashboardContext();

  return (
    <main className="page-shell max-w-[90rem] lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-6">
      <DashboardSidebar
        userName={session.user?.name}
        userEmail={session.user?.email}
        userImage={session.user?.image}
      />
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </main>
  );
}
