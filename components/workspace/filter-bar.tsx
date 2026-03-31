"use client";

import { useDeferredValue, useEffect, useEffectEvent, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useSyncAppBusyState } from "@/components/providers/app-navigation-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type AssigneeOption = {
  id: string;
  label: string;
};

export function WorkspaceFilterBar({
  assignees,
  initialSearch,
  initialAssigneeId,
}: {
  assignees: AssigneeOption[];
  initialSearch?: string;
  initialAssigneeId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch ?? "");
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId ?? "");
  const deferredSearch = useDeferredValue(search);
  const [isPending, startTransition] = useTransition();

  useSyncAppBusyState("project-filters", isPending, "Refreshing project filters...");

  const syncFilters = useEffectEvent((nextSearch: string, nextAssigneeId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSearch.trim()) {
      params.set("q", nextSearch.trim());
    } else {
      params.delete("q");
    }

    if (nextAssigneeId) {
      params.set("assignee", nextAssigneeId);
    } else {
      params.delete("assignee");
    }

    params.delete("task");

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    });
  });

  useEffect(() => {
    syncFilters(deferredSearch, assigneeId);
  }, [assigneeId, deferredSearch]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <label className="relative block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Search tasks
          </span>
          <Search className="pointer-events-none absolute left-3 top-[calc(50%+10px)] h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-9"
            disabled={isPending}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by task name or description"
            value={search}
          />
        </label>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400" htmlFor="assignee-filter">
            Assignee
          </Label>
          <Select disabled={isPending} id="assignee-filter" onChange={(event) => setAssigneeId(event.target.value)} value={assigneeId}>
            <option value="">All assignees</option>
            {assignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
