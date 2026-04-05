import { ScoringWeightManager } from "@/components/admin/scoring-weight-manager";
import { getAdminOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminScoringPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Scoring Engine</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tune the transparent weighted recommendation model.</h1>
      </div>
      <ScoringWeightManager weights={data.weights} />
    </div>
  );
}
