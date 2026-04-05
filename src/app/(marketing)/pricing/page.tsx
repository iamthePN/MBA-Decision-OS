import { getMarketingContent } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { pricingPlans } = await getMarketingContent();

  return (
    <div className="container-shell space-y-10 py-12 lg:py-16">
      <div className="max-w-4xl space-y-4">
        <p className="section-kicker">Pricing</p>
        <h1 className="text-4xl font-semibold tracking-tight">Choose the depth of guidance that matches your decision stage.</h1>
        <p className="text-lg text-muted-foreground">The demo includes realistic plan structure and seeded content that admins can edit directly from the dashboard.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className={plan.highlighted ? "border-primary shadow-glow" : ""}>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold">{plan.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                {plan.highlighted ? <Badge>Most Popular</Badge> : null}
              </div>
              <div>
                <p className="text-4xl font-semibold tracking-tight">{plan.priceMonthly === 0 ? "Free" : formatCurrency(plan.priceMonthly)}</p>
                <p className="text-sm text-muted-foreground">{plan.priceMonthly === 0 ? "Start with profile evaluation and sample recommendations." : "Monthly, with mock pricing seeded for the demo."}</p>
              </div>
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="rounded-2xl bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    {feature}
                  </div>
                ))}
              </div>
              <Button className="w-full">{plan.ctaLabel}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
