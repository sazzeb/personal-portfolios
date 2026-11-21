"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/protected/admin" ||
    pathname.startsWith("/protected/admin/") ||
    pathname === "/protected/account"
    ? null
    : children;
}
