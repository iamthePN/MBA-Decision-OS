import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { RiskMeter } from "@/components/dashboard/risk-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRecommendationFeed } from "@/lib/data";
import { requireUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const session = await requireUser();
  const recommendations = await getRecommendationFeed(session.user.id, 12);

  if (!recommendations.length) {
    return <EmptyState title="No recommendations yet" body="Complete the student profile so the engine can generate ranked recommendations." ctaHref="/portal/profile" ctaLabel="Complete profile" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Recommendation Engine</p>
        <h1 className="text-3xl font-semibold tracking-tight">Personalized colleges ranked by fit, ROI, placements, and risk alignment.</h1>
      </div>
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <Card key={recommendation.college.id} className={index === 0 ? "border-primary" : ""}>
            <CardContent className="grid gap-5 p-6 xl:grid-cols-[1fr,220px] xl:items-center">
              <div className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <Link href={`/portal/colleges/${recommendation.college.slug}`} className="text-2xl font-semibold hover:text-primary">
                      {recommendation.college.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{recommendation.college.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{Math.round(recommendation.finalRecommendationScore)}% overall match</Badge>
                    <Badge variant={recommendation.college.riskLevel === "SAFE" ? "success" : recommendation.college.riskLevel === "BALANCED" ? "warning" : "danger"}>{recommendation.college.riskLevel}</Badge>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-4 text-sm">
                  <Metric label="ROI score" value={`${Math.round(recommendation.roiScore)}%`} />
                  <Metric label="Admission probability" value={`${Math.round(recommendation.admissionProbability)}%`} />
                  <Metric label="Payback estimate" value={`${recommendation.paybackEstimate.toFixed(1)} years`} />
                  <Metric label="Expected package" value={formatCurrency(recommendation.college.averageSalary)} />
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{recommendation.explainability}</p>
                <div className="rounded-3xl bg-muted/20 p-4 text-sm text-muted-foreground">Predicted role outcomes: {recommendation.roleOutcomes.join(", ")}</div>
                <RiskMeter level={recommendation.riskCompatibilityScore} />
              </div>
              <div className="space-y-3 xl:justify-self-end">
                <Link href={`/portal/colleges/${recommendation.college.slug}`}>
                  <Button className="w-full">Open detail</Button>
                </Link>
                <Link href={`/portal/compare?ids=${recommendation.college.id}`}>
                  <Button className="w-full" variant="outline">Compare</Button>
                </Link>
                <Link href={`/portal/simulator?collegeId=${recommendation.college.id}`}>
                  <Button className="w-full" variant="ghost">Simulate outcome</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/30 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
