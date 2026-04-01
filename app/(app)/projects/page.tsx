import { ProjectsWorkspace } from "@/components/projects/projects-workspace";
import { requireCurrentMembership } from "@/modules/auth/server";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const membership = await requireCurrentMembership();

  return <ProjectsWorkspace workspaceId={membership.workspaceId} />;
}
