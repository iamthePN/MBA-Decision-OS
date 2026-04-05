import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { MetricCard } from "@/components/dashboard/metric-card";
import { OutcomeTrendChart } from "@/components/dashboard/outcome-trend-chart";
import { RiskMeter } from "@/components/dashboard/risk-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  const session = await requireUser();
  const data = await getDashboardData(session.user.id);

  if (!data.profile) {
    return (
      <EmptyState
        title="Your decision engine starts with a complete profile."
        body="Fill in academics, exams, work experience, goals, budget, and preferences so the recommendation engine can generate ranked colleges, ROI projections, and career scenarios."
        ctaHref="/portal/profile"
        ctaLabel="Build profile"
      />
    );
  }

  const outcomeData = [
    { name: "Now", value: 900000 },
    { name: "1Y", value: data.careerSnapshot ? data.careerSnapshot.expectedSalary : 1200000 },
    { name: "3Y", value: data.careerSnapshot ? data.careerSnapshot.expectedSalary * 1.8 : 1800000 },
    { name: "5Y", value: data.careerSnapshot ? data.careerSnapshot.expectedSalary * 2.8 : 2800000 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Profile completion" value={`${data.profile.profileCompletion}%`} helper="Profile readiness for scoring" score={data.profile.profileCompletion} />
        <MetricCard label="Profile strength" value={`${Math.round(data.headlineMetrics.profileStrengthScore)} / 100`} helper="Academic, exam, work, and leadership blend" score={data.headlineMetrics.profileStrengthScore} tone="success" />
        <MetricCard label="Admission readiness" value={`${Math.round(data.headlineMetrics.admissionReadinessScore)} / 100`} helper="How ready your current profile looks" score={data.headlineMetrics.admissionReadinessScore} />
        <MetricCard label="ROI score" value={`${Math.round(data.headlineMetrics.roiScore)} / 100`} helper="Best-fit ROI signal from top recommendation" score={data.headlineMetrics.roiScore} tone={data.headlineMetrics.roiScore > 70 ? "success" : "warning"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <OutcomeTrendChart data={outcomeData} />
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Career snapshot</p>
                <h2 className="text-2xl font-semibold">Your current best-fit outcome</h2>
              </div>
              {data.careerSnapshot ? <Badge>{data.careerSnapshot.expectedRole}</Badge> : null}
            </div>
            {data.careerSnapshot ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">Expected salary</p>
                    <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.careerSnapshot.expectedSalary)}</p>
                  </div>
                  <div className="rounded-3xl bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">Payback estimate</p>
                    <p className="mt-2 text-2xl font-semibold">{data.careerSnapshot.paybackEstimate.toFixed(1)} years</p>
                  </div>
                </div>
                <RiskMeter level={data.topRecommendations[0]?.riskCompatibilityScore ?? 0} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Recommendations will appear here once a profile is available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Top recommended colleges</h2>
              <Link href="/portal/recommendations">
                <Button size="sm" variant="outline">View all</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {data.topRecommendations.map((item) => (
                <div key={item.college.id} className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <Link href={`/portal/colleges/${item.college.slug}`} className="text-lg font-semibold hover:text-primary">
                        {item.college.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.college.location}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Match</p>
                        <p className="font-medium">{Math.round(item.finalRecommendationScore)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ROI</p>
                        <p className="font-medium">{Math.round(item.roiScore)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Admission</p>
                        <p className="font-medium">{Math.round(item.admissionProbability)}%</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.explainability}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Alerts and watchouts</h2>
              <Badge variant={data.warnings.length ? "warning" : "success"}>{data.warnings.length ? `${data.warnings.length} active` : "Clear"}</Badge>
            </div>
            {data.warnings.length ? (
              <div className="space-y-4">
                {data.warnings.map((warning) => (
                  <div key={warning.title} className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                    <p className="font-semibold">{warning.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{warning.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No major risks are currently flagged across your top options.</p>
            )}
            <div className="rounded-3xl border border-border/70 bg-slate-950 p-5 text-slate-50">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Pipeline</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-300">Shortlisted colleges</p>
                  <p className="mt-1 text-3xl font-semibold">{data.shortlistCount}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Applications in progress</p>
                  <p className="mt-1 text-3xl font-semibold">{data.applications.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
