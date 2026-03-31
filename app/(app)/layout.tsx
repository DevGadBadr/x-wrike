import { AppShell } from "@/components/layout/app-shell";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { getUnreadNotificationCount } from "@/modules/notifications/service";
import { requireCurrentMembership } from "@/modules/auth/server";
import { listProjectExplorer } from "@/modules/projects/service";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const membership = await requireCurrentMembership();
  const [unreadCount, projectExplorer] = await Promise.all([
    getUnreadNotificationCount(membership.userId),
    listProjectExplorer(membership.workspaceId),
  ]);

  return (
    <AppShell
      sidebar={<AppSidebar explorer={projectExplorer} workspaceName={membership.workspace.name} />}
      topbar={<AppTopbar unreadCount={unreadCount} user={membership.user} />}
    >
      {children}
    </AppShell>
  );
}
