"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";

import DeleteLinkDialog from "@/components/app/delete-link-dialog";
import QrDialog from "@/components/app/qr-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getShortUrl } from "@/lib/format";

type Props = {
  link: { id: string; slug: string; totalClicks: number };
};

export default function LinkActions({ link }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const shortUrl = getShortUrl(link.slug);

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button variant="outline" size="sm" onClick={copy}>
        {copied ? <Check /> : <Copy />}
        Copy link
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-sm" onClick={() => setQrOpen(true)} aria-label="QR code">
            <QrCode />
          </Button>
        </TooltipTrigger>
        <TooltipContent>QR code</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-sm" asChild>
            <a href={shortUrl} target="_blank" rel="noreferrer" aria-label="Open short link">
              <ExternalLink />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Open short link</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete link"
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>

      <QrDialog slug={qrOpen ? link.slug : null} shortUrl={shortUrl} onOpenChange={setQrOpen} />
      <DeleteLinkDialog
        link={deleteOpen ? link : null}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push("/dashboard")}
      />
    </div>
  );
}
