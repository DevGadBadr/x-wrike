"use client";

import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { useOptionalAppNavigation } from "@/components/providers/app-navigation-provider";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  className,
  variant = "ghost",
}: {
  className?: string;
  variant?: "ghost" | "outline" | "destructive";
}) {
  const [pending, setPending] = useState(false);
  const appNavigation = useOptionalAppNavigation();

  return (
    <Button
      className={className}
      disabled={pending}
      onClick={async () => {
        appNavigation?.setActivityBusy("sign-out", true, "Signing out...");
        setPending(true);

        try {
          await signOut({ callbackUrl: "/" });
        } catch {
          appNavigation?.setActivityBusy("sign-out", false, "Signing out...");
          setPending(false);
        }
      }}
      type="button"
      variant={variant}
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
