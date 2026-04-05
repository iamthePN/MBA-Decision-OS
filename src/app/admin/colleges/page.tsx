import { AdminCollegeManager } from "@/components/admin/college-manager";
import { getAdminOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCollegesPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">College Management</p>
        <h1 className="text-3xl font-semibold tracking-tight">CRUD the college catalog and import CSV data.</h1>
      </div>
      <AdminCollegeManager
        colleges={data.colleges.map((college) => ({
          id: college.id,
          slug: college.slug,
          name: college.name,
          location: college.location,
          city: college.city,
          country: college.country,
          overview: college.overview,
          totalFees: college.totalFees,
          livingCostAnnual: college.livingCostAnnual,
          averageSalary: college.averageSalary,
          medianSalary: college.medianSalary,
          highestSalary: college.highestSalary,
          placementRate: college.placementRate,
          paybackPeriod: college.paybackPeriod,
          intakeSize: college.intakeSize,
          durationMonths: college.durationMonths,
          type: college.type,
          riskLevel: college.riskLevel,
          rankingNote: college.rankingNote,
          website: college.website,
          logoText: college.logoText,
          featured: college.featured,
          examCodes: college.examAcceptances.map((item) => item.examType.code),
          specializations: college.specializations.map((item) => item.specialization.name),
          recruiters: college.recruiters.map((item) => item.recruiter.name),
          sectors: college.sectors.map((item) => item.sector.name),
          topRoles: college.placementStat?.topRoles ?? [],
          consultingShare: college.placementStat?.consultingShare ?? 0,
          financeShare: college.placementStat?.financeShare ?? 0,
          analyticsShare: college.placementStat?.analyticsShare ?? 0,
          productShare: college.placementStat?.productShare ?? 0,
          operationsShare: college.placementStat?.operationsShare ?? 0,
          internationalPlacementRate: college.placementStat?.internationalPlacementRate ?? 0
        }))}
      />
    </div>
  );
}
