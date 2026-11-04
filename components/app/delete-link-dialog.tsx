"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Props = {
  link: { id: string; slug: string; totalClicks: number } | null;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

export default function DeleteLinkDialog({ link, onOpenChange, onDeleted }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!link) return;
    setPending(true);
    try {
      await api.delete(`/api/links/${link.id}`);
      toast.success(`Deleted /${link.slug}`);
      onOpenChange(false);
      onDeleted?.();
      router.refresh();
    } catch {
      toast.error("Couldn't delete the link. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog open={Boolean(link)} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete <span className="font-mono">/{link?.slug}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The short link will stop working immediately
            {link && link.totalClicks > 0
              ? ` and its ${link.totalClicks} recorded clicks will be removed.`
              : "."}{" "}
            This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? "Deleting…" : "Delete link"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
