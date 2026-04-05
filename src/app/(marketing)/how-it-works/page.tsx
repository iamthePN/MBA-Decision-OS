import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Enter scores and profile",
    body: "Students input academics, entrance exam scores, work experience, goals, budget, preferred industries, and financing constraints."
  },
  {
    title: "Build a candidate digital twin",
    body: "The system creates a structured profile model that acts as the student’s decision baseline across all colleges."
  },
  {
    title: "Simulate outcomes",
    body: "Admission probability, placement quality, expected earnings, payback period, and risk are modeled using explainable rules."
  },
  {
    title: "Compare ROI and placements",
    body: "Students compare multiple colleges side by side using fees, packages, fit, probability, and payback horizon."
  },
  {
    title: "Shortlist and track applications",
    body: "The portal converts insights into action with shortlists, status tracking, deadlines, notes, and next steps."
  }
];

export default function HowItWorksPage() {
  return (
    <div className="container-shell space-y-10 py-12 lg:py-16">
      <div className="max-w-4xl space-y-4">
        <p className="section-kicker">How It Works</p>
        <h1 className="text-4xl font-semibold tracking-tight">A full-stack decision workflow from profile input to final shortlist.</h1>
        <p className="text-lg text-muted-foreground">The flow is built to reduce confusion, surface tradeoffs early, and make every program choice feel explainable and actionable.</p>
      </div>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <CardContent className="grid gap-5 p-6 lg:grid-cols-[120px,1fr,48px] lg:items-center">
              <div>
                <p className="section-kicker">Step {index + 1}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
