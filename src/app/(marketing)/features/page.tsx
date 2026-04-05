import { BarChart3, BriefcaseBusiness, Building2, CircleDollarSign, Gauge, GitCompareArrows, Radar, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Gauge, title: "Profile evaluation", body: "Measure academic consistency, exam quality, work experience, goals, and leadership with explainable scoring." },
  { icon: Sparkles, title: "Admission probability", body: "Estimate readiness and admission odds using profile strength and college-specific fit signals." },
  { icon: CircleDollarSign, title: "ROI calculator", body: "Project total investment, salary expectations, payback period, and long-term financial outcomes." },
  { icon: BriefcaseBusiness, title: "Placement intelligence", body: "See role quality, recruiter depth, sector exposure, and compensation benchmarks." },
  { icon: BarChart3, title: "Career path simulator", body: "Build a digital twin and compare safe, balanced, and high-risk outcome scenarios over time." },
  { icon: Radar, title: "Risk meter", body: "Align program risk with the user’s own appetite and financing sensitivity." },
  { icon: Building2, title: "Smart shortlisting", body: "Rank colleges by fit instead of raw ranking and keep the best options visible." },
  { icon: GitCompareArrows, title: "Application tracking", body: "Monitor deadlines, statuses, fees paid, and the next step across the application funnel." }
];

export default function FeaturesPage() {
  return (
    <div className="container-shell space-y-10 py-12 lg:py-16">
      <div className="max-w-4xl space-y-4">
        <p className="section-kicker">Features</p>
        <h1 className="text-4xl font-semibold tracking-tight">Everything needed to move from uncertainty to a high-conviction MBA decision.</h1>
        <p className="text-lg text-muted-foreground">Each module is designed to answer one core student question: where will I get in, what will it cost, what will I become, and was it worth it?</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="space-y-4 p-6">
              <feature.icon className="h-10 w-10 text-primary" />
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{feature.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
