import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { NoAccess } from "@/components/admin/no-access";
import { getSessionUser, isAdminUser } from "@/lib/auth";

export default async function AdminPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Auth guard: not signed in → login; signed in but not an admin → no access.
  const user = await getSessionUser();
  if (!user) redirect(`/${locale}/admin/login`);
  if (!isAdminUser(user)) return <NoAccess />;

  return (
    <div className="flex min-h-dvh flex-col bg-cream-100 md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
    </div>
  );
}
