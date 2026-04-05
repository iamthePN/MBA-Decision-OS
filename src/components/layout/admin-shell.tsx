"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Building2, Gauge, LayoutDashboard, LogOut, MessageSquare, Settings2, Users2 } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LogoMark } from "@/components/layout/logo-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/colleges", label: "Colleges", icon: Building2 },
  { href: "/admin/scoring", label: "Scoring", icon: Gauge },
  { href: "/admin/users", label: "Users", icon: Users2 },
  { href: "/admin/content", label: "Content", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings2 }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px,1fr] lg:px-6">
        <aside className="rounded-[32px] border border-border/70 bg-background p-5 shadow-soft lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="mb-8 flex items-start justify-between gap-3">
            <LogoMark className="pr-4" />
            <ThemeToggle />
          </div>
          <div className="mb-6 rounded-3xl bg-slate-950 p-4 text-slate-50">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Admin Control</p>
            <p className="mt-2 text-lg font-semibold">Decision Ops</p>
            <p className="mt-1 text-sm text-slate-300">Tune scoring logic, refresh institution data, and monitor pipeline health.</p>
          </div>
          <nav className="space-y-2">
            {adminLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Button
            className="mt-6 w-full"
            type="button"
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </aside>
        <main className="space-y-6">
          <div className="rounded-[32px] border border-border/70 bg-background p-5 shadow-soft">
            <Breadcrumbs />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
