"use client";

import { Download, QrCode, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import QRCode from "qrcode";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  shortUrl: string;
};

export default function QRButton({ shortUrl }: Props) {
  const [qrCode, setQrCode] = useState("");
  const [open, setOpen] = useState(false);

  async function generateQR() {
    if (!qrCode) {
      const qr = await QRCode.toDataURL(shortUrl);
      setQrCode(qr);
    }

    setOpen(true);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          onClick={generateQR}
          className="action-button"
          title="QR Code"
          aria-label="Generate QR code"
        >
          <QrCode className="size-4" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-xl border  border-white/80 bg-[rgba(255,255,255,0.82)] backdrop-blur-xl shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <button
          type="button"
          className="action-button absolute right-4 top-4 !h-10 !w-10 !min-h-0 !min-w-0 !p-0 z-10"
          onClick={() => setOpen(false)}
          aria-label="Close QR dialog"
        >
          <X className="size-4" />
        </button>

        <AlertDialogHeader className="pr-12">
          <AlertDialogTitle>QR code</AlertDialogTitle>
          <AlertDialogDescription>
            Scan or download the generated QR code to share this short link
            across print, events, packaging, or offline campaigns.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
          <div className="surface-muted flex min-h-[290px] items-center justify-center px-4 py-6">
            {qrCode && (
              <Image
                src={qrCode}
                alt="QR Code"
                width={250}
                height={250}
                unoptimized
                className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-sm"
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748b]">
                Short URL
              </p>
              <p className="mt-2 break-all font-mono text-sm leading-6 text-[#0f172a]">
                {shortUrl}
              </p>
            </div>

            {qrCode && (
              <a
                href={qrCode}
                download="qrcode.png"
                className="primary-button h-12 w-full"
              >
                <Download className="size-4" />
                <span>Download QR</span>
              </a>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
