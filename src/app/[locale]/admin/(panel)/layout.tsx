import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Auth guard: no session → login.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  return (
    <div className="flex min-h-dvh flex-col bg-cream-100 md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
    </div>
  );
}
