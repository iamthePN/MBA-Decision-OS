import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container-shell space-y-10 py-12 lg:py-16">
      <div className="max-w-4xl space-y-4">
        <p className="section-kicker">About MBA Decision OS</p>
        <h1 className="text-4xl font-semibold tracking-tight">Built to become the world’s most trusted MBA decision platform.</h1>
        <p className="text-lg text-muted-foreground">
          MBA Decision OS is designed to make higher education decisions measurable. The platform prioritizes career outcomes, financial returns, and profile fit over vanity rankings or marketing noise.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="section-kicker">Vision</p>
            <p className="text-xl font-semibold leading-8">
              To become the world’s most trusted MBA decision platform and the best ROI provider, ensuring every student maximizes career outcomes, financial returns, and long-term growth from their MBA investment.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="section-kicker">What the platform does</p>
            <p className="text-muted-foreground">
              It combines candidate profile evaluation, explainable scoring, college discovery, ROI simulation, placement intelligence, and application tracking in one end-to-end decision workspace.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          "Empower MBA aspirants with transparent, unbiased, and personalized insights that help them choose programs delivering the highest ROI for their unique profile.",
          "Build an intelligent MBA Decision OS that evaluates candidate potential, predicts admissions and placement outcomes, and ranks institutions based on ROI, role quality, and career trajectory.",
          "Minimize financial risk, prevent mismatched MBA choices, and create a data-led ecosystem where education decisions are measured by outcomes, not hype or rankings."
        ].map((mission, index) => (
          <Card key={mission}>
            <CardContent className="space-y-4 p-6">
              <p className="section-kicker">Mission {index + 1}</p>
              <p className="text-sm leading-7 text-muted-foreground">{mission}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
          <div>
            <p className="section-kicker">Why it is different</p>
            <h2 className="mt-3 text-2xl font-semibold">The student stays at the center of the model.</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Most sites organize the journey around college brand or static rankings. MBA Decision OS organizes it around student fit, role quality, and long-term payoff.</p>
            <p>The system is explainable by design, with configurable weights, recommendation logic, risk modeling, and transparent ROI formulas that admins can tune over time.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
