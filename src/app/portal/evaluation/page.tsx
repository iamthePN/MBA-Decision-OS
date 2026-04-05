import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getStudentProfileByUserId } from "@/lib/data";
import { calculateProfileStrength, scoreNarrative } from "@/lib/scoring/engine";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EvaluationPage() {
  const session = await requireUser();
  const profile = await getStudentProfileByUserId(session.user.id);

  if (!profile) {
    return <EmptyState title="No profile found" body="Complete the profile builder first to view profile evaluation and readiness scoring." ctaHref="/portal/profile" ctaLabel="Build profile" />;
  }

  const strength = calculateProfileStrength(profile);
  const academicContribution = ((profile.tenthScore + profile.twelfthScore + profile.undergraduateScore) / 3) * 0.24;
  const examContribution = ((profile.examScores[0]?.score ?? 0) / (profile.examScores[0]?.examType.maxScore ?? 100)) * 100 * 0.28;
  const workContribution = Math.min(100, 100 - Math.abs(profile.workExperienceMonths - 30) * 2.2) * 0.18;
  const extracurricularContribution = Math.min(100, profile.achievements.length * 14) * 0.12;
  const goalContribution = Math.min(100, (profile.shortTermGoals.length + profile.longTermGoals.length) * 0.16) * 0.1;
  const budgetContribution = profile.preference ? 75 * 0.08 : 40 * 0.08;

  return (
    <div className="space-y-6">
      <div>
        <p className="section-kicker">Profile Evaluation</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Transparent scoring, plain-English interpretation.</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">This view breaks down the components driving your profile strength and readiness index so the system remains explainable rather than opaque.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">Profile strength score</p>
            <p className="text-4xl font-semibold">{Math.round(strength)}</p>
            <p className="text-sm text-muted-foreground">{scoreNarrative(strength, "Profile strength")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">Readiness index</p>
            <p className="text-4xl font-semibold">{Math.round((strength + (profile.profileCompletion ?? 0)) / 2)}</p>
            <p className="text-sm text-muted-foreground">{scoreNarrative((strength + (profile.profileCompletion ?? 0)) / 2, "Admission readiness")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-sm text-muted-foreground">Explainability</p>
            <p className="text-sm leading-7 text-muted-foreground">Your strongest signals currently come from academics, exam quality, and the amount of structured work experience captured in your profile.</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {[
          ["Academic score contribution", academicContribution],
          ["Exam score contribution", examContribution],
          ["Work experience contribution", workContribution],
          ["Extracurricular contribution", extracurricularContribution],
          ["Goal clarity contribution", goalContribution],
          ["Budget-fit contribution", budgetContribution]
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-3xl font-semibold">{Number(value).toFixed(1)}</p>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Number(value) * 4)}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
