import { EmptyState } from "@/components/dashboard/empty-state";
import { SimulatorWorkbench } from "@/components/forms/simulator-workbench";
import { getRecommendationFeed } from "@/lib/data";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SimulatorPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requireUser();
  const params = await searchParams;
  const recommendations = await getRecommendationFeed(session.user.id, 12);

  if (!recommendations.length) {
    return <EmptyState title="Simulator unavailable" body="Complete your profile first to generate recommendations and unlock the digital twin simulator." ctaHref="/portal/profile" ctaLabel="Complete profile" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Career Path Simulator</p>
        <h1 className="text-3xl font-semibold tracking-tight">Model safe, balanced, and high-upside MBA outcomes before you commit.</h1>
      </div>
      <SimulatorWorkbench
        colleges={recommendations.map((item) => ({
          id: item.college.id,
          name: item.college.name,
          totalFees: item.college.totalFees,
          livingCostAnnual: item.college.livingCostAnnual,
          averageSalary: item.college.averageSalary,
          medianSalary: item.college.medianSalary,
          paybackPeriod: item.paybackEstimate,
          placementRate: item.college.placementRate,
          riskLevel: item.college.riskLevel,
          specializations: item.college.specializations.map((entry) => entry.specialization.name),
          topRoles: item.roleOutcomes
        }))}
        defaultCollegeId={typeof params.collegeId === "string" ? params.collegeId : recommendations[0]?.college.id}
      />
    </div>
  );
}
