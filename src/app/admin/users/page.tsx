import { Card, CardContent } from "@/components/ui/card";
import { getAdminOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Users and Pipeline</p>
        <h1 className="text-3xl font-semibold tracking-tight">View users, shortlists, and application status activity.</h1>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Users</h2>
            {data.users.map((user) => (
              <div key={user.id} className="rounded-3xl bg-muted/20 p-4 text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email} · {user.role}</p>
                <p className="mt-2 text-muted-foreground">Shortlists: {user.shortlists.length} · Applications: {user.applications.length}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Applications</h2>
            {data.applications.map((application) => (
              <div key={application.id} className="rounded-3xl bg-muted/20 p-4 text-sm">
                <p className="font-medium">{application.user.name} · {application.college.name}</p>
                <p className="text-muted-foreground">{application.status} · Fees paid {application.feesPaid}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
