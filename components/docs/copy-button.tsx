"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CopyButton({ value, label = "Copy code" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button variant="ghost" size="icon-xs" onClick={copy} aria-label={copied ? "Copied" : label}>
      {copied ? <Check className="text-success" /> : <Copy />}
    </Button>
  );
}
