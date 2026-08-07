import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RedirectIfNotAuthenticated } from "@/components/auth/redirect-if-not-authenticated";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RedirectIfNotAuthenticated>
      <DashboardShell>{children}</DashboardShell>
    </RedirectIfNotAuthenticated>
  );
}
