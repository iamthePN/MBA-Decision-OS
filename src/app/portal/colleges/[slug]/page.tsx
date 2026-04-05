import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { RiskMeter } from "@/components/dashboard/risk-meter";
import { ShortlistButton } from "@/components/forms/shortlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCollegeDetail } from "@/lib/data";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await requireUser();
  const { slug } = await params;
  const result = await getCollegeDetail(session.user.id, slug);

  if (!result) {
    return <EmptyState title="College not found" body="The requested college does not exist in the seeded dataset." ctaHref="/portal/colleges" ctaLabel="Back to discovery" />;
  }

  const shortlist = await prisma.shortlist.findUnique({
    where: {
      userId_collegeId: {
        userId: session.user.id,
        collegeId: result.college.id
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">{result.college.logoText}</div>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight">{result.college.name}</h1>
                    <p className="text-sm text-muted-foreground">{result.college.location}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{result.college.overview}</p>
              </div>
              <Badge variant={result.college.riskLevel === "SAFE" ? "success" : result.college.riskLevel === "BALANCED" ? "warning" : "danger"}>{result.college.riskLevel}</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <ShortlistButton collegeId={result.college.id} initialShortlisted={Boolean(shortlist)} />
              <Link href={`/portal/applications?collegeId=${result.college.id}`}>
                <Button>Apply now</Button>
              </Link>
              <Link href={`/portal/compare?ids=${result.college.id}`}>
                <Button variant="outline">Compare</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-5 p-6">
            <h2 className="text-xl font-semibold">Decision snapshot</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Metric label="Total fees" value={formatCurrency(result.college.totalFees)} />
              <Metric label="Average salary" value={formatCurrency(result.college.averageSalary)} />
              <Metric label="Median salary" value={formatCurrency(result.college.medianSalary)} />
              <Metric label="Highest salary" value={formatCurrency(result.college.highestSalary)} />
              <Metric label="ROI score" value={`${Math.round(result.breakdown?.roiScore ?? 0)}%`} />
              <Metric label="Payback period" value={`${result.college.paybackPeriod.toFixed(1)} years`} />
              <Metric label="Profile match" value={`${Math.round(result.breakdown?.collegeMatchScore ?? 0)}%`} />
              <Metric label="Admission probability" value={`${Math.round(result.breakdown?.admissionProbability ?? 0)}%`} />
            </div>
            <RiskMeter level={result.breakdown?.riskCompatibilityScore ?? 0} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card>
          <CardContent className="space-y-5 p-6">
            <h2 className="text-xl font-semibold">Placement intelligence</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Metric label="Placement rate" value={`${result.college.placementRate}%`} />
              <Metric label="Role outcomes" value={(result.breakdown?.roleOutcomes ?? []).slice(0, 2).join(", ")} />
              <Metric label="Top recruiters" value={result.college.recruiters.map((item) => item.recruiter.name).slice(0, 4).join(", ")} />
              <Metric label="Placement sectors" value={result.college.sectors.map((item) => item.sector.name).slice(0, 4).join(", ")} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-5 p-6">
            <h2 className="text-xl font-semibold">Why it ranks here</h2>
            <p className="text-sm leading-7 text-muted-foreground">{result.breakdown?.explainability ?? "Complete your profile to unlock personalized explanation."}</p>
            <div className="space-y-3">
              <div className="rounded-3xl bg-muted/20 p-4 text-sm text-muted-foreground">Accepted exams: {result.college.examAcceptances.map((item) => item.examType.code).join(", ")}</div>
              <div className="rounded-3xl bg-muted/20 p-4 text-sm text-muted-foreground">Specialization strengths: {result.college.specializations.map((item) => item.specialization.name).join(", ")}</div>
              <div className="rounded-3xl bg-muted/20 p-4 text-sm text-muted-foreground">Comparison with your preferences: location fit {Math.round(result.breakdown?.locationFitScore ?? 0)}%, budget fit {Math.round(result.breakdown?.budgetFitScore ?? 0)}%.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/30 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}
