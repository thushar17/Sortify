import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getAuthenticatedDashboardContext } from "@/lib/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Sortify",
  description:
    "Manage your short links, view analytics, and access API keys.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = await getAuthenticatedDashboardContext();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        userName={session.user?.name}
        userEmail={session.user?.email}
        userImage={session.user?.image}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-5 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
