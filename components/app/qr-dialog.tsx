"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  slug: string | null;
  shortUrl: string;
  onOpenChange: (open: boolean) => void;
};

export default function QrDialog({ slug, shortUrl, onOpenChange }: Props) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    QRCode.toDataURL(shortUrl, { width: 480, margin: 1 }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, shortUrl]);

  return (
    <Dialog open={Boolean(slug)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>QR code</DialogTitle>
          <DialogDescription className="truncate font-mono text-xs">{shortUrl}</DialogDescription>
        </DialogHeader>
        <div className="flex aspect-square items-center justify-center rounded-md border bg-white p-3">
          {dataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt={`QR code for ${shortUrl}`} className="size-full" />
          )}
        </div>
        <Button asChild variant="outline" disabled={!dataUrl}>
          <a href={dataUrl} download={`sortify-${slug}.png`}>
            <Download />
            Download PNG
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
