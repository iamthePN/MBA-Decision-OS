import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, CircleDollarSign, ShieldCheck, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMarketingContent } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const differentiators = [
  "Profile-fit based, not ranking-only",
  "Outcome-first, not admission-only",
  "ROI-focused, not fee-focused",
  "Candidate-centric, not college-centric",
  "Predictive and explainable, not static",
  "Dynamic recommendation engine, not generic counseling"
];

const outcomes = [
  "Better college selection decisions",
  "Reduced financial risk",
  "Higher placement satisfaction",
  "Increased admission success rate",
  "Transparent and unbiased MBA decision-making"
];

export default async function HomePage() {
  const { testimonials, pricingPlans, featuredColleges } = await getMarketingContent();

  return (
    <div>
      <section className="container-shell py-10 lg:py-16">
        <div className="glass-panel overflow-hidden bg-hero-gradient p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
            <div className="space-y-6">
              <Badge>Best ROI Provider</Badge>
              <div className="space-y-4">
                <p className="section-kicker">MBA Decision OS</p>
                <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  <span className="gradient-title">From applications to outcomes.</span>
                  <br />
                  Choose MBA programs by fit, probability, payback, and career trajectory.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  MBA Decision OS is an outcome-first decision intelligence platform that evaluates candidate profiles and ranks programs using explainable scoring across admission odds, ROI, placements, role quality, and long-term financial return.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Explore Demo
                  </Button>
                </Link>
                <Link href="/portal/compare">
                  <Button size="lg" variant="ghost">
                    Compare Colleges
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                {[
                  { label: "Admission confidence", value: "Explainable" },
                  { label: "ROI modeling", value: "3Y / 5Y" },
                  { label: "Risk planning", value: "Personalized" }
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-none bg-slate-950 text-slate-50 shadow-glow">
              <CardContent className="space-y-6 p-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-slate-300">Outcome Snapshot</p>
                  <h2 className="mt-3 text-2xl font-semibold">Build a digital twin of your MBA journey.</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: Target, label: "Profile strength", value: "84 / 100" },
                    { icon: CircleDollarSign, label: "ROI score", value: "79 / 100" },
                    { icon: BriefcaseBusiness, label: "Role quality", value: "Balanced consulting + analytics" },
                    { icon: ShieldCheck, label: "Risk alignment", value: "Strong fit with balanced schools" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-emerald-300" />
                        <div>
                          <p className="text-sm text-slate-300">{item.label}</p>
                          <p className="font-medium text-slate-50">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-shell py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "The problem",
              body: "Students still choose MBA programs using fragmented rankings, fee lists, and brand narratives that hide placement quality, payback speed, and role outcomes."
            },
            {
              icon: Sparkles,
              title: "The solution",
              body: "MBA Decision OS creates a candidate-centric operating system that scores the right schools for your profile, budget, goals, and risk appetite."
            },
            {
              icon: ShieldCheck,
              title: "The promise",
              body: "Transparent, unbiased, and explainable recommendations that reduce decision risk and improve long-term career returns."
            }
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-4 p-6">
                <item.icon className="h-10 w-10 text-primary" />
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
          <div className="space-y-4">
            <p className="section-kicker">Why It Wins</p>
            <h2 className="text-3xl font-semibold tracking-tight">Decision intelligence, not a college directory.</h2>
            <p className="text-muted-foreground">
              The product is built to help students make better bets, not just browse brands. Every recommendation is grounded in profile fit, admission probability, ROI, placements, and long-term career upside.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {differentiators.map((item) => (
              <Card key={item} className="bg-card/90">
                <CardContent className="p-5 text-sm text-muted-foreground">{item}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <Card>
            <CardContent className="space-y-5 p-6">
              <p className="section-kicker">Featured Programs</p>
              <h2 className="text-2xl font-semibold">High-visibility programs in the demo dataset</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {featuredColleges.slice(0, 4).map((college) => (
                  <div key={college.id} className="rounded-3xl border border-border/70 bg-muted/20 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{college.name}</p>
                        <p className="text-sm text-muted-foreground">{college.location}</p>
                      </div>
                      <Badge variant={college.riskLevel === "SAFE" ? "success" : college.riskLevel === "BALANCED" ? "warning" : "danger"}>
                        {college.riskLevel}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Fees</p>
                        <p className="font-medium">{formatCurrency(college.totalFees)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg package</p>
                        <p className="font-medium">{formatCurrency(college.averageSalary)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payback</p>
                        <p className="font-medium">{college.paybackPeriod.toFixed(1)} years</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Placement</p>
                        <p className="font-medium">{college.placementRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-5 p-6">
              <p className="section-kicker">Anticipated Outcomes</p>
              <h2 className="text-2xl font-semibold">What students should feel after using the platform</h2>
              <div className="space-y-3">
                {outcomes.map((item) => (
                  <div key={item} className="rounded-3xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container-shell py-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          <Card>
            <CardContent className="space-y-5 p-6">
              <p className="section-kicker">Testimonials</p>
              <h2 className="text-2xl font-semibold">Students trust outcome visibility over hype.</h2>
              <div className="space-y-4">
                {testimonials.slice(0, 3).map((testimonial) => (
                  <div key={testimonial.id} className="rounded-3xl border border-border/70 bg-muted/20 p-5">
                    <p className="text-sm leading-6 text-muted-foreground">“{testimonial.quote}”</p>
                    <div className="mt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role} · {testimonial.program}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 text-slate-50">
            <CardContent className="space-y-5 p-6">
              <p className="section-kicker text-emerald-300">Pricing Preview</p>
              <h2 className="text-2xl font-semibold">Start free, upgrade when you want deeper planning.</h2>
              <div className="space-y-4">
                {pricingPlans.map((plan) => (
                  <div key={plan.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{plan.name}</p>
                        <p className="text-sm text-slate-300">{plan.description}</p>
                      </div>
                      <p className="text-xl font-semibold">{plan.priceMonthly === 0 ? "Free" : `${formatCurrency(plan.priceMonthly)} / mo`}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/pricing">
                <Button variant="secondary">See full pricing</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
