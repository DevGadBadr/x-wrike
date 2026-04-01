"use client";

import { KanbanSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PendingLink } from "@/components/shared/pending-link";
import { cn } from "@/lib/utils";

type AssetNode = {
  id: string;
  name: string;
  key?: string;
  status?: string;
  taskCount?: number;
  openTaskCount?: number;
};

export function ExplorerTree({
  title,
  basePath,
  assets,
  selectedAssetId,
  variant = "panel",
}: {
  title: string;
  basePath: string;
  assets: AssetNode[];
  selectedAssetId?: string | null;
  variant?: "panel" | "sidebar";
}) {
  const isSidebar = variant === "sidebar";

  return (
    <div className={cn("space-y-4", isSidebar && "space-y-2")}>
      {isSidebar ? (
        <div className="flex items-center justify-between gap-3 px-2 pt-1">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            {title}
          </h2>
          <Badge variant="neutral">{assets.length}</Badge>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Explorer</p>
            <h2 className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{title}</h2>
          </div>
          <Badge variant="neutral">{assets.length} projects</Badge>
        </div>
      )}

      <div className="space-y-1">
        {assets.map((asset) => (
          <PendingLink
            busyMessage="Loading project..."
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition",
              selectedAssetId === asset.id
                ? "bg-zinc-950 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
              isSidebar && "py-1.5",
            )}
            href={`${basePath}/${asset.id}`}
            key={asset.id}
          >
            <KanbanSquare className="h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{asset.name}</p>
              <p className="truncate text-[11px] uppercase tracking-[0.2em] opacity-70">{asset.key}</p>
            </div>
            <span className="rounded-full bg-black/8 px-2 py-1 text-[11px] font-medium dark:bg-white/10">
              {asset.openTaskCount ?? asset.taskCount ?? 0}
            </span>
          </PendingLink>
        ))}
      </div>
    </div>
  );
}
