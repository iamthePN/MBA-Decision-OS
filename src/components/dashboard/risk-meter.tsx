import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export function RiskMeter({ level, className }: { level: number; className?: string }) {
  const icon = level >= 75 ? <ShieldCheck className="h-4 w-4" /> : level >= 55 ? <AlertTriangle className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />;
  const label = level >= 75 ? "Aligned" : level >= 55 ? "Balanced" : "High caution";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 font-medium">{icon}{label}</span>
        <span className="text-muted-foreground">{Math.round(level)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            level >= 75 ? "bg-success" : level >= 55 ? "bg-warning" : "bg-danger"
          )}
          style={{ width: `${Math.max(0, Math.min(100, level))}%` }}
        />
      </div>
    </div>
  );
}
