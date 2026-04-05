import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ShortlistButton } from "@/components/forms/shortlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDiscoveryData } from "@/lib/data";
import { requireUser } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CollegesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await requireUser();
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const discovery = await getDiscoveryData(session.user.id, {
    search: typeof params.q === "string" ? params.q : undefined,
    location: typeof params.location === "string" ? params.location : undefined,
    exam: typeof params.exam === "string" ? params.exam : undefined,
    type: typeof params.type === "string" ? params.type : undefined,
    risk: typeof params.risk === "string" ? params.risk : undefined,
    minRoi: typeof params.minRoi === "string" ? Number(params.minRoi) : undefined,
    maxFees: typeof params.maxFees === "string" ? Number(params.maxFees) : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    page
  });

  if (!discovery.items.length) {
    return <EmptyState title="No colleges matched the current filters" body="Try broadening location, fee, or exam filters to surface more programs." ctaHref="/portal/colleges" ctaLabel="Clear filters" />;
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") query.set(key, value);
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">College Discovery</p>
        <h1 className="text-3xl font-semibold tracking-tight">Filter, sort, and compare outcome-fit programs.</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <form action="/portal/colleges" className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <input className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" defaultValue={typeof params.q === "string" ? params.q : ""} name="q" placeholder="Search college or city" />
            <input className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" defaultValue={typeof params.location === "string" ? params.location : ""} name="location" placeholder="Location" />
            <input className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" defaultValue={typeof params.exam === "string" ? params.exam : ""} name="exam" placeholder="Exam code" />
            <input className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" defaultValue={typeof params.maxFees === "string" ? params.maxFees : ""} name="maxFees" placeholder="Max fees" />
            <input className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" defaultValue={typeof params.minRoi === "string" ? params.minRoi : ""} name="minRoi" placeholder="Min ROI score" />
            <button className="h-11 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground" type="submit">Apply filters</button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        {discovery.items.map(({ college, breakdown }) => (
          <Card key={college.id}>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link className="text-xl font-semibold hover:text-primary" href={`/portal/colleges/${college.slug}`}>
                    {college.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{college.location}</p>
                </div>
                <Badge variant={college.riskLevel === "SAFE" ? "success" : college.riskLevel === "BALANCED" ? "warning" : "danger"}>{college.riskLevel}</Badge>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{college.overview}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Metric label="Fees" value={formatCurrency(college.totalFees)} />
                <Metric label="Avg package" value={formatCurrency(college.averageSalary)} />
                <Metric label="ROI" value={`${Math.round(breakdown?.roiScore ?? 0)}%`} />
                <Metric label="Admission" value={`${Math.round(breakdown?.admissionProbability ?? 0)}%`} />
                <Metric label="Fit score" value={`${Math.round(breakdown?.finalRecommendationScore ?? 0)}%`} />
                <Metric label="Payback" value={`${college.paybackPeriod.toFixed(1)} years`} />
              </div>
              <div className="flex flex-wrap gap-3">
                <ShortlistButton collegeId={college.id} />
                <Link href={`/portal/compare?ids=${college.id}`}>
                  <Button variant="outline">Compare</Button>
                </Link>
                <Link href={`/portal/applications?collegeId=${college.id}`}>
                  <Button variant="ghost">Apply now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page {page} of {discovery.totalPages}</p>
        <div className="flex gap-3">
          {page > 1 ? (
            <Link href={`/portal/colleges?${withPage(query, page - 1)}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          ) : (
            <Button disabled variant="outline">Previous</Button>
          )}
          {page < discovery.totalPages ? (
            <Link href={`/portal/colleges?${withPage(query, page + 1)}`}>
              <Button variant="outline">Next</Button>
            </Link>
          ) : (
            <Button disabled variant="outline">Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/30 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function withPage(query: URLSearchParams, page: number) {
  const next = new URLSearchParams(query.toString());
  next.set("page", String(page));
  return next.toString();
}
