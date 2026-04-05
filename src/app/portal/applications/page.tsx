import { ApplicationManager } from "@/components/forms/application-manager";
import { getStudentContext } from "@/lib/data";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const session = await requireUser();
  const context = await getStudentContext(session.user.id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Application Tracker</p>
        <h1 className="text-3xl font-semibold tracking-tight">Track deadlines, status changes, notes, and fees in one place.</h1>
      </div>
      <ApplicationManager
        applications={context.applications.map((application) => ({
          id: application.id,
          collegeId: application.collegeId,
          status: application.status,
          deadline: application.deadline ? application.deadline.toISOString() : null,
          note: application.note,
          feesPaid: application.feesPaid,
          nextStep: application.nextStep,
          college: {
            id: application.college.id,
            name: application.college.name,
            location: application.college.location
          }
        }))}
        colleges={context.colleges.map((college) => ({ id: college.id, name: college.name, location: college.location }))}
      />
    </div>
  );
}
