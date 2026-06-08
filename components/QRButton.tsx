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
        <button type="button" onClick={generateQR} className="action-button">
          <QrCode className="size-4" />
          <span>QR Code</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-xl">
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
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
                className="rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Short URL
              </p>
              <p className="mt-2 break-all text-sm leading-6 text-slate-700">
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
