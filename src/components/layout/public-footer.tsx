import Link from "next/link";

import { LogoMark } from "@/components/layout/logo-mark";

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.5fr,1fr,1fr] lg:px-8">
        <div className="space-y-4">
          <LogoMark />
          <p className="max-w-md text-sm text-muted-foreground">
            MBA Decision OS helps students move from uncertain applications to measurable career outcomes through explainable recommendations.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <Link className="block hover:text-foreground" href="/features">
              Features
            </Link>
            <Link className="block hover:text-foreground" href="/pricing">
              Pricing
            </Link>
            <Link className="block hover:text-foreground" href="/how-it-works">
              How it works
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Resources</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <Link className="block hover:text-foreground" href="/contact">
              Contact
            </Link>
            <Link className="block hover:text-foreground" href="/login">
              Demo login
            </Link>
            <Link className="block hover:text-foreground" href="/pricing">
              Counselor plan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
