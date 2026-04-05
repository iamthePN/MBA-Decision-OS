import { ProfileBuilderForm } from "@/components/forms/profile-builder-form";
import { getStudentProfileByUserId } from "@/lib/data";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireUser();
  const profile = await getStudentProfileByUserId(session.user.id);
  const exam = profile?.examScores[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="section-kicker">Profile Builder</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Build the candidate digital twin.</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">Capture scores, goals, financing constraints, and career intent so the recommendation engine can rank programs around your actual outcome profile.</p>
      </div>
      <ProfileBuilderForm
        initialValues={{
          fullName: session.user.name ?? "",
          country: profile?.country,
          academicHistory: profile?.academicHistory ?? "",
          undergradInstitution: profile?.undergradInstitution ?? "",
          undergradDegree: profile?.undergradDegree ?? "",
          tenthScore: profile?.tenthScore,
          twelfthScore: profile?.twelfthScore,
          undergraduateScore: profile?.undergraduateScore,
          examTypeCode: exam?.examType.code,
          examScore: exam?.score,
          examPercentile: exam?.percentile ?? undefined,
          workExperienceMonths: profile?.workExperienceMonths,
          currentJobRole: profile?.currentJobRole ?? "",
          preferredSpecialization: profile?.preference?.specialization?.name,
          preferredLocation: profile?.preference?.preferredLocation ?? "",
          budgetMin: profile?.preference?.budgetMin,
          budgetMax: profile?.preference?.budgetMax,
          riskAppetite: profile?.preference?.riskAppetite,
          shortTermGoals: profile?.shortTermGoals,
          longTermGoals: profile?.longTermGoals,
          preferredIndustriesText: profile?.preferredIndustries?.join(", "),
          scholarshipNeed: profile?.scholarshipNeed,
          targetIntakeYear: profile?.targetIntakeYear,
          fundingMode: profile?.preference?.fundingMode,
          targetRole: profile?.preference?.targetRole ?? "",
          internshipsText: profile?.achievements.filter((item) => item.type === "INTERNSHIP").map((item) => item.title).join(", "),
          extracurricularText: profile?.achievements.filter((item) => item.type === "EXTRACURRICULAR" || item.type === "LEADERSHIP").map((item) => item.title).join(", "),
          certificationsText: profile?.achievements.filter((item) => item.type === "CERTIFICATION").map((item) => item.title).join(", ")
        }}
      />
    </div>
  );
}

