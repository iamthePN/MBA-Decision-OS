"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/portal" className="hover:text-foreground">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = segment.replaceAll("-", " ");
        return (
          <span key={href} className="inline-flex items-center gap-2 capitalize">
            <ChevronRight className="h-4 w-4" />
            <Link className="hover:text-foreground" href={href}>
              {label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
