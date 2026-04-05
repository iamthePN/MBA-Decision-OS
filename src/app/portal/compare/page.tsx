import { EmptyState } from "@/components/dashboard/empty-state";
import { CompareWorkbench } from "@/components/forms/compare-workbench";
import { getRecommendationFeed } from "@/lib/data";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requireUser();
  const params = await searchParams;
  const recommendations = await getRecommendationFeed(session.user.id, 20);
  const ids = typeof params.ids === "string" ? params.ids.split(",").filter(Boolean) : [];

  if (!recommendations.length) {
    return <EmptyState title="Comparison unavailable" body="You need recommendation data before colleges can be compared meaningfully." ctaHref="/portal/profile" ctaLabel="Complete profile" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Compare Colleges</p>
        <h1 className="text-3xl font-semibold tracking-tight">Put up to three colleges side by side and expose the real tradeoffs.</h1>
      </div>
      <CompareWorkbench
        initialIds={ids}
        colleges={recommendations.map((item) => ({
          id: item.college.id,
          slug: item.college.slug,
          name: item.college.name,
          location: item.college.location,
          totalFees: item.college.totalFees,
          averageSalary: item.college.averageSalary,
          medianSalary: item.college.medianSalary,
          paybackPeriod: item.paybackEstimate,
          placementRate: item.college.placementRate,
          riskLevel: item.college.riskLevel,
          breakdown: {
            finalRecommendationScore: item.finalRecommendationScore,
            admissionProbability: item.admissionProbability,
            roiScore: item.roiScore,
            roleOutcomes: item.roleOutcomes
          }
        }))}
      />
    </div>
  );
}
