import { Card, CardContent } from "@/components/ui/card";
import { getAdminOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Admin Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">Manage the decision engine and operating data.</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Users", String(data.users.length)],
          ["Colleges", String(data.colleges.length)],
          ["Applications", String(data.applications.length)],
          ["Messages", String(data.contacts.length)]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="space-y-2 p-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-4xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Recent users</h2>
            {data.users.slice(0, 6).map((user) => (
              <div key={user.id} className="rounded-3xl bg-muted/20 p-4 text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email} · {user.role}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Recent applications</h2>
            {data.applications.slice(0, 6).map((application) => (
              <div key={application.id} className="rounded-3xl bg-muted/20 p-4 text-sm">
                <p className="font-medium">{application.user.name} · {application.college.name}</p>
                <p className="text-muted-foreground">{application.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
