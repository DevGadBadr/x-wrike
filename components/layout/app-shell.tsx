"use client";

import { LoaderCircle } from "lucide-react";

import { AppNavigationProvider, useAppNavigation } from "@/components/providers/app-navigation-provider";
import { cn } from "@/lib/utils";

export function AppShell({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AppNavigationProvider>
      <ShellFrame sidebar={sidebar} topbar={topbar}>
        {children}
      </ShellFrame>
    </AppNavigationProvider>
  );
}

function ShellFrame({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}) {
  const { busyMessage, isBusy } = useAppNavigation();

  return (
    <div className="flex min-h-screen bg-[#eef2f7] dark:bg-[#0d1117]">
      {sidebar}
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="relative">
          {topbar}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 top-full h-1 overflow-hidden transition-opacity duration-200",
              isBusy ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="h-full w-full origin-left animate-[app-shell-progress_1.15s_ease-in-out_infinite] bg-sky-500/70" />
          </div>
        </div>
        <main aria-busy={isBusy} className="relative flex-1 px-5 py-5 lg:px-6">
          <div className={cn("transition-opacity duration-200", isBusy && "pointer-events-none opacity-45")}>
            {children}
          </div>
          <div
            aria-live="polite"
            className={cn(
              "pointer-events-none absolute inset-x-5 top-5 z-20 flex justify-end transition duration-200 lg:inset-x-6",
              isBusy ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            )}
          >
            <div className="flex items-center gap-2 rounded-full border border-sky-200 bg-white/96 px-3 py-2 text-xs font-medium text-sky-700 shadow-sm backdrop-blur dark:border-sky-500/30 dark:bg-zinc-950/92 dark:text-sky-300">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              <span>{busyMessage}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
