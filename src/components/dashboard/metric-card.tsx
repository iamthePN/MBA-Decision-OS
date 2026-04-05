import { ArrowRight, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function MetricCard({
  label,
  value,
  helper,
  score,
  tone = "default"
}: {
  label: string;
  value: string;
  helper: string;
  score?: number;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <Badge variant={tone === "success" ? "success" : tone === "warning" ? "warning" : "default"}>
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Live
          </Badge>
        </div>
        {typeof score === "number" ? <Progress value={score} /> : null}
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>{helper}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
