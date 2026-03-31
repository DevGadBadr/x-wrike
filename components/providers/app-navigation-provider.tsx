"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

type BusyActivity = {
  message: string;
};

type AppNavigationContextValue = {
  busyMessage: string;
  isBusy: boolean;
  startNavigation: (href: string, message?: string) => void;
  setActivityBusy: (id: string, active: boolean, message?: string) => void;
};

const DEFAULT_BUSY_MESSAGE = "Loading workspace...";

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null);

function getRouteKey(pathname: string, searchParams: ReadonlyURLSearchParams) {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export function AppNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = useMemo(() => getRouteKey(pathname, searchParams), [pathname, searchParams]);
  const [navigationBusy, setNavigationBusy] = useState<{
    message: string;
    targetHref: string | null;
  }>({
    message: DEFAULT_BUSY_MESSAGE,
    targetHref: null,
  });
  const [activities, setActivities] = useState<Record<string, BusyActivity>>({});

  const startNavigation = useCallback(
    (href: string, message = DEFAULT_BUSY_MESSAGE) => {
      if (href === routeKey) {
        return;
      }

      setNavigationBusy({
        message,
        targetHref: href,
      });
    },
    [routeKey],
  );

  const setActivityBusy = useCallback(
    (id: string, active: boolean, message = "Updating workspace...") => {
      setActivities((current) => {
        if (!active) {
          if (!(id in current)) {
            return current;
          }

          const next = { ...current };
          delete next[id];
          return next;
        }

        const existing = current[id];

        if (existing && existing.message === message) {
          return current;
        }

        return {
          ...current,
          [id]: { message },
        };
      });
    },
    [],
  );

  const value = useMemo<AppNavigationContextValue>(() => {
    const activeActivity = Object.values(activities)[0];
    const activityMessage = activeActivity?.message;
    const navigationActive = Boolean(
      navigationBusy.targetHref && navigationBusy.targetHref !== routeKey,
    );

    return {
      busyMessage: activityMessage ?? navigationBusy.message,
      isBusy: navigationActive || Boolean(activeActivity),
      setActivityBusy,
      startNavigation,
    };
  }, [activities, navigationBusy.message, navigationBusy.targetHref, routeKey, setActivityBusy, startNavigation]);

  return <AppNavigationContext.Provider value={value}>{children}</AppNavigationContext.Provider>;
}

export function useAppNavigation() {
  const context = useContext(AppNavigationContext);

  if (!context) {
    throw new Error("useAppNavigation must be used within AppNavigationProvider.");
  }

  return context;
}

export function useOptionalAppNavigation() {
  return useContext(AppNavigationContext);
}

export function useSyncAppBusyState(id: string, active: boolean, message?: string) {
  const { setActivityBusy } = useAppNavigation();

  useEffect(() => {
    setActivityBusy(id, active, message);

    return () => {
      setActivityBusy(id, false, message);
    };
  }, [active, id, message, setActivityBusy]);
}
