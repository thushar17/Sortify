import Link from "next/link";

import { Logo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SiteHeader({ wide = false }: { wide?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95">
      <div className={cn("mx-auto flex h-14 items-center justify-between px-4 sm:px-6", wide ? "max-w-7xl" : "max-w-6xl")}>
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <a href="https://github.com/thushar17/Sortify" target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
