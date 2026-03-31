"use client";

import { useState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button, type ButtonProps } from "@/components/ui/button";

export function GoogleSignInButton({
  busyLabel = "Redirecting to Google...",
  callbackUrl = "/dashboard",
  label = "Continue with Google",
  onPendingChange,
  ...props
}: {
  busyLabel?: string;
  callbackUrl?: string;
  label?: string;
  onPendingChange?: (pending: boolean) => void;
} & Omit<ButtonProps, "children" | "onClick" | "type">) {
  const [pending, setPending] = useState(false);

  return (
    <Button
      {...props}
      disabled={props.disabled || pending}
      onClick={async () => {
        if (pending) {
          return;
        }

        setPending(true);
        onPendingChange?.(true);

        try {
          await signIn("google", { callbackUrl });
        } catch {
          setPending(false);
          onPendingChange?.(false);
        }
      }}
      type="button"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      {pending ? busyLabel : label}
    </Button>
  );
}
