"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BarChart3, BriefcaseBusiness, Building2, FileSpreadsheet, Gauge, GitCompareArrows, LayoutDashboard, LogOut, Settings, Sparkles, UserCircle2 } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LogoMark } from "@/components/layout/logo-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/profile", label: "Profile Builder", icon: UserCircle2 },
  { href: "/portal/evaluation", label: "Evaluation", icon: Gauge },
  { href: "/portal/colleges", label: "Discovery", icon: Building2 },
  { href: "/portal/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/portal/simulator", label: "Digital Twin", icon: BarChart3 },
  { href: "/portal/applications", label: "Applications", icon: FileSpreadsheet },
  { href: "/portal/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/portal/settings", label: "Settings", icon: Settings }
];

export function PortalShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px,1fr] lg:px-6">
        <aside className="rounded-[32px] border border-border/70 bg-background p-5 shadow-soft lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="mb-8 flex items-start justify-between gap-3">
            <LogoMark className="pr-4" />
            <ThemeToggle />
          </div>
          <div className="mb-6 rounded-3xl bg-hero-gradient p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Student Workspace</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{userName}</p>
            <p className="mt-1 text-sm text-muted-foreground">Decision intelligence for every shortlist, every application, every outcome.</p>
          </div>
          <nav className="space-y-2">
            {links.map((link) => {
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
          <div className="mt-8 rounded-3xl border border-border/60 bg-muted/40 p-4">
            <p className="text-sm font-semibold">Need a reset on your list?</p>
            <p className="mt-2 text-sm text-muted-foreground">The recommendation engine updates as soon as you refine profile, budget, or career intent.</p>
            <Link href="/portal/recommendations" className="mt-4 inline-block">
              <Button size="sm">Refresh Recommendations</Button>
            </Link>
          </div>
          <Button
            className="mt-4 w-full"
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Breadcrumbs />
              <div className="flex items-center gap-3">
                <Link href="/portal/applications">
                  <Button variant="outline" size="sm">
                    <BriefcaseBusiness className="mr-2 h-4 w-4" />
                    Track Deadlines
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
