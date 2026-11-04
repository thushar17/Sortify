"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";

export default function ApiKeyManager({ prefix }: { prefix: string | null }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setPending(true);
    try {
      const { data } = await api.post("/api/create-api-key");
      setNewKey(data.apiKey);
      setCopied(false);
      router.refresh();
    } catch {
      toast.error("Couldn't generate a key. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function copy() {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {prefix ? (
            <p className="truncate font-mono text-sm text-foreground">
              sk_sortify_{prefix}
              <span className="text-muted-foreground">••••••••••••••••••••••••••••••••••••••••</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">You don&apos;t have an API key yet.</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {prefix ? "Only the first characters are stored in readable form." : "Create one to use the REST API."}
          </p>
        </div>

        {prefix ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={pending}>
                {pending ? "Generating…" : "Regenerate"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate API key?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your current key stops working right away. Anything using it will get 401 errors until you
                  update it with the new key.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={generate} className="bg-destructive text-white hover:bg-destructive/90">
                  Regenerate key
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button onClick={generate} disabled={pending}>
            {pending ? "Generating…" : "Create API key"}
          </Button>
        )}
      </div>

      <Dialog open={Boolean(newKey)} onOpenChange={(open) => !open && setNewKey(null)}>
        <DialogContent className="sm:max-w-lg" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Save your API key</DialogTitle>
            <DialogDescription>
              This is the only time the full key is shown. Store it somewhere safe, like your server&apos;s
              environment variables.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-md border bg-muted py-1 pl-3 pr-1">
            <code className="min-w-0 flex-1 break-all font-mono text-[13px]">{newKey}</code>
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setNewKey(null)} disabled={!copied} title={copied ? undefined : "Copy the key first"}>
              I&apos;ve saved it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
