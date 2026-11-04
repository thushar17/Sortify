import { Metadata } from "next";

import AppSidebar from "@/components/app/app-sidebar";
import AppTopbar from "@/components/app/app-topbar";
import { getAuthenticatedDashboardContext, getUserLinkIndex } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your short links, view analytics, and access API keys.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, user } = await getAuthenticatedDashboardContext();
  const links = await getUserLinkIndex(user.id);

  const sidebarUser = {
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image,
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={sidebarUser} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar user={sidebarUser} links={links} />
        <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
