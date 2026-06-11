"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

type Props = {
  slug: string;
};

export default function CopyButton({ slug }: Props) {
  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    toast.success("Link copied!");
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="action-button"
      title="Copy short link"
      aria-label={`Copy short link for ${slug}`}
    >
      <Copy className="size-4" />
    </button>
  );
}
