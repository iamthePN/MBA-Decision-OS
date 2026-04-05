import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Link className={cn("inline-flex items-center gap-3", className)} href="/">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-glow">
        M
      </div>
      <div>
        <p className="font-display text-base font-semibold tracking-tight text-foreground">MBA Decision OS</p>
        <p className="text-xs text-muted-foreground">From Applications to Outcomes</p>
      </div>
    </Link>
  );
}
