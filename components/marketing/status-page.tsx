import Link from "next/link";

import { Logo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";

type Props = {
  code?: string;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
};

export default function StatusPage({ code, title, children, action }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-24">
        <div className="w-full max-w-[400px]">
          {code && <p className="font-mono text-[13px] text-muted-foreground">{code}</p>}
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{title}</h1>
          {children && <div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>}
          <div className="mt-6">
            {action ?? (
              <Button variant="outline" asChild>
                <Link href="/">Go to Sortify</Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
