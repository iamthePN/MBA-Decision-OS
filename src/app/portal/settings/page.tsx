import Link from "next/link";

import { SettingsPanels } from "@/components/forms/settings-panels";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireUser();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">Account, theme, and exports.</h1>
      </div>
      <SettingsPanels email={session.user.email ?? ""} name={session.user.name ?? "Student"} />
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Export outputs</h2>
          <p className="text-sm text-muted-foreground">Download your current shortlist, application tracker, or printable recommendation report.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/api/export/shortlist">
              <Button variant="outline">Export shortlist CSV</Button>
            </Link>
            <Link href="/api/export/applications">
              <Button variant="outline">Export application tracker CSV</Button>
            </Link>
            <Link href="/portal/report">
              <Button>Open printable report</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
