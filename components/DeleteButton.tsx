"use client";

import { Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";

type Props = {
  id: string;
};

export default function DeleteButton({ id }: Props) {
  const router = useRouter();

  async function deleteLink() {
    try {
      await api.delete(`/api/links/${id}`);
      toast.success("Link deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete link");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className="danger-button">
          <Trash2 className="size-4" />
          <span>Delete</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader className="items-center sm:items-start">
          <AlertDialogMedia className="bg-rose-50/90 text-rose-700 shadow-[0_14px_35px_rgba(244,63,94,0.12)]">
            <TriangleAlert className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this link?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The short link and its associated
            access point will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteLink} variant="destructive">
            Delete link
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
