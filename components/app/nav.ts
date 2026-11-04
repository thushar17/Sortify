import { BookOpen, KeyRound, Link2, UserRound } from "lucide-react";

export const primaryNav = [
  { href: "/dashboard", icon: Link2, label: "Links" },
  { href: "/dashboard/api-keys", icon: KeyRound, label: "API keys" },
  { href: "/docs", icon: BookOpen, label: "Docs" },
];

export const accountNav = [
  { href: "/dashboard/profile", icon: UserRound, label: "Profile" },
];

export function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return (
      pathname === "/dashboard" ||
      (pathname.startsWith("/dashboard/") &&
        !primaryNav.some((item) => item.href !== "/dashboard" && pathname.startsWith(item.href)) &&
        !accountNav.some((item) => pathname.startsWith(item.href)))
    );
  }
  return pathname.startsWith(href);
}

export function getBreadcrumb(pathname: string) {
  const match = [...primaryNav, ...accountNav]
    .filter((item) => item.href !== "/dashboard")
    .find((item) => pathname.startsWith(item.href));

  if (match) {
    return [{ label: match.label }];
  }

  const slug = pathname.replace(/^\/dashboard\/?/, "");
  if (slug) {
    return [{ label: "Links", href: "/dashboard" }, { label: slug, mono: true }];
  }

  return [{ label: "Links" }];
}
