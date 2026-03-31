"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useSyncAppBusyState } from "@/components/providers/app-navigation-provider";
import { ensureAppPath } from "@/lib/auth-path";
import { Button } from "@/components/ui/button";

export function MarkNotificationsReadButton() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  useSyncAppBusyState("mark-notifications-read", pending, "Refreshing notifications...");

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await fetch(ensureAppPath("/api/notifications/read"), { method: "POST" });
          router.refresh();
        })
      }
      type="button"
      variant="outline"
    >
      {pending ? "Updating..." : "Mark all read"}
    </Button>
  );
}
