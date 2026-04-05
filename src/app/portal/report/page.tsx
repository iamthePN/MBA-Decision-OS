import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { OutcomeTrendChart } from "@/components/dashboard/outcome-trend-chart";
import { PrintButton } from "@/components/forms/print-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRecommendationFeed, getStudentProfileByUserId } from "@/lib/data";
import { requireUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  const session = await requireUser();
  const profile = await getStudentProfileByUserId(session.user.id);
  const recommendations = await getRecommendationFeed(session.user.id, 5);

  if (!profile || !recommendations.length) {
    return <EmptyState title="Report unavailable" body="A profile and recommendation set are required before the printable report can be generated." ctaHref="/portal/profile" ctaLabel="Complete profile" />;
  }

  const chartData = [
    { name: "Current", value: 900000 },
    { name: "1Y", value: recommendations[0].college.averageSalary },
    { name: "3Y", value: recommendations[0].college.averageSalary * 1.8 },
    { name: "5Y", value: recommendations[0].college.averageSalary * 2.8 }
  ];

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <div>
          <p className="section-kicker">Printable Report</p>
          <h1 className="text-3xl font-semibold tracking-tight">Recommendation report</h1>
        </div>
        <div className="flex gap-3">
          <PrintButton />
          <Link href="/portal/settings">
            <Button variant="outline">Back to settings</Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardContent className="space-y-6 p-8">
          <div>
            <h2 className="text-3xl font-semibold">MBA Decision OS</h2>
            <p className="text-muted-foreground">Recommendation report for {session.user.name}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportMetric label="Country" value={profile.country} />
            <ReportMetric label="Target intake" value={String(profile.targetIntakeYear)} />
            <ReportMetric label="Preferred location" value={profile.preference?.preferredLocation ?? "Flexible"} />
            <ReportMetric label="Risk appetite" value={profile.preference?.riskAppetite ?? "MEDIUM"} />
          </div>
          <OutcomeTrendChart data={chartData} />
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Top colleges</h3>
            {recommendations.map((item, index) => (
              <div key={item.college.id} className="rounded-3xl border border-border/70 p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{index + 1}. {item.college.name}</p>
                    <p className="text-sm text-muted-foreground">{item.college.location}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <ReportMetric label="Match" value={`${Math.round(item.finalRecommendationScore)}%`} compact />
                    <ReportMetric label="ROI" value={`${Math.round(item.roiScore)}%`} compact />
                    <ReportMetric label="Admission" value={`${Math.round(item.admissionProbability)}%`} compact />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.explainability}</p>
                <div className="mt-3 text-sm text-muted-foreground">Estimated package: {formatCurrency(item.college.averageSalary)} · Payback: {item.paybackEstimate.toFixed(1)} years · Roles: {item.roleOutcomes.join(", ")}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportMetric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl bg-muted/30 ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}
