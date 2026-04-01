import type { ProjectStatus } from "@prisma/client";

import { db } from "@/lib/db";

export async function listProjects(workspaceId: string) {
  return db.project.findMany({
    where: {
      workspaceId,
      isArchived: false,
    },
    include: {
      folder: true,
      owner: {
        include: {
          user: true,
        },
      },
      tasks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function listProjectExplorer(workspaceId: string) {
  const projects = await db.project.findMany({
    where: {
      workspaceId,
      isArchived: false,
    },
    select: {
      id: true,
      name: true,
      key: true,
      status: true,
      tasks: {
        where: {
          isArchived: false,
        },
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  return {
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      key: project.key,
      status: project.status,
      taskCount: project.tasks.length,
      openTaskCount: project.tasks.filter((task) => task.status !== "DONE" && task.status !== "CANCELLED").length,
    })),
  };
}

export async function getProjectWorkspace(
  projectId: string,
  workspaceId: string,
  filters?: {
    assigneeMembershipId?: string;
    search?: string;
  },
) {
  const search = filters?.search?.trim();

  return db.project.findFirstOrThrow({
    where: {
      id: projectId,
      workspaceId,
      isArchived: false,
    },
    include: {
      folder: true,
      owner: {
        include: {
          user: true,
        },
      },
      members: {
        include: {
          membership: {
            include: {
              user: true,
            },
          },
        },
      },
      tasks: {
        where: {
          isArchived: false,
          ...(filters?.assigneeMembershipId
            ? {
                assigneeMembershipId: filters.assigneeMembershipId,
              }
            : {}),
          ...(search
            ? {
                OR: [
                  {
                    title: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
        include: {
          assignee: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [
          {
            position: "asc",
          },
          {
            startDate: "asc",
          },
          {
            dueDate: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      },
    },
  });
}

export async function getProjectDetails(projectId: string, workspaceId: string) {
  return db.project.findFirstOrThrow({
    where: {
      id: projectId,
      workspaceId,
    },
    include: {
      folder: true,
      owner: {
        include: {
          user: true,
        },
      },
      members: {
        include: {
          membership: {
            include: {
              user: true,
            },
          },
        },
      },
      tasks: {
        where: {
          isArchived: false,
        },
        include: {
          assignee: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [
          {
            dueDate: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      },
    },
  });
}

export async function createProject(input: {
  workspaceId: string;
  ownerMembershipId: string;
  actorUserId: string;
  name: string;
  key: string;
  description?: string;
  status: ProjectStatus;
  dueDate?: string;
}) {
  const project = await db.project.create({
    data: {
      workspaceId: input.workspaceId,
      ownerMembershipId: input.ownerMembershipId,
      name: input.name,
      key: input.key,
      description: input.description || null,
      status: input.status,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      members: {
        create: {
          membershipId: input.ownerMembershipId,
        },
      },
    },
  });

  await db.activityLog.create({
    data: {
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId,
      entityType: "PROJECT",
      entityId: project.id,
      action: "CREATED",
      message: `Created project ${project.name}`,
      metadata: {
        key: project.key,
      },
    },
  });

  return project;
}
