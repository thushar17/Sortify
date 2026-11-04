"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

function getCallbackUrl(value: string | null) {
  // Only allow same-site paths so the parameter can't send people elsewhere.
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default function SignInCard() {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const callbackUrl = getCallbackUrl(searchParams.get("callbackUrl"));

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full gap-3 bg-card"
      disabled={pending}
      onClick={() => {
        setPending(true);
        signIn("google", { callbackUrl });
      }}
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/google.svg" alt="" width={18} height={18} className="size-[18px]" />
      )}
      {pending ? "Redirecting to Google…" : "Continue with Google"}
    </Button>
  );
}
