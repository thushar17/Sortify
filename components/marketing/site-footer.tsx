import Link from "next/link";

import { Logo } from "@/components/app/logo";

export default function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <span>© {new Date().getFullYear()}</span>
        </div>
        <nav className="flex gap-5">
          <Link href="/docs" className="hover:text-foreground">
            API docs
          </Link>
          <a href="https://github.com/thushar17/Sortify" target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <Link href="/sign-in" className="hover:text-foreground">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
