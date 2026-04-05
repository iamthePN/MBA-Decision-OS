import { Card, CardContent } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Platform Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">Integration readiness and deployment checkpoints.</h1>
      </div>
      <Card>
        <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
          <p>Use the `.env.example` file to configure database, authentication secret, email provider, analytics provider, and optional AI summarization provider.</p>
          <p>The admin dashboard already exposes scoring weights and content. Optional external services remain behind feature flags and can be connected later without changing core student flows.</p>
        </CardContent>
      </Card>
    </div>
  );
}
