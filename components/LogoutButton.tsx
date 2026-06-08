import { LogOut } from "lucide-react";

import { signOut } from "@/auth";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function LogoutButton({ className }: Props) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className={cn("w-full sm:w-auto", className)}
    >
      <button type="submit" className="secondary-button w-full justify-start sm:w-auto">
        <LogOut className="size-4" />
        <span>Logout</span>
      </button>
    </form>
  );
}
