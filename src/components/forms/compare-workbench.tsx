"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

export function CompareWorkbench({
  colleges,
  initialIds
}: {
  colleges: Array<{ id: string; slug: string; name: string; location: string; totalFees: number; averageSalary: number; medianSalary: number; paybackPeriod: number; placementRate: number; riskLevel: string; breakdown?: { finalRecommendationScore: number; admissionProbability: number; roiScore: number; roleOutcomes: string[] } | null }>;
  initialIds: string[];
}) {
  const [selected, setSelected] = useState<string[]>(() => initialIds.slice(0, 3));

  useEffect(() => {
    if (selected.length === 0 && colleges.length >= 3) {
      setSelected(colleges.slice(0, 3).map((college) => college.id));
    }
  }, [colleges, selected.length]);

  const selectedColleges = useMemo(
    () => selected.map((id) => colleges.find((college) => college.id === id)).filter(Boolean) as typeof colleges,
    [colleges, selected]
  );

  const updateSlot = (index: number, value: string) => {
    setSelected((current) => {
      const next = [...current];
      next[index] = value;
      return Array.from(new Set(next)).slice(0, 3);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-5 p-6 md:grid-cols-3">
          {[0, 1, 2].map((slot) => (
            <div key={slot}>
              <Label>College {slot + 1}</Label>
              <Select value={selected[slot] ?? ""} onChange={(event) => updateSlot(slot, event.target.value)}>
                <option value="">Select a college</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>{college.name}</option>
                ))}
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        {selectedColleges.map((college) => (
          <Card key={college.id}>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{college.name}</h2>
                  <p className="text-sm text-muted-foreground">{college.location}</p>
                </div>
                <ArrowRightLeft className="h-5 w-5 text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <CompareMetric label="Fees" value={formatCurrency(college.totalFees)} />
                <CompareMetric label="Avg package" value={formatCurrency(college.averageSalary)} />
                <CompareMetric label="Median package" value={formatCurrency(college.medianSalary)} />
                <CompareMetric label="Payback" value={`${college.paybackPeriod.toFixed(1)} years`} />
                <CompareMetric label="Placement" value={`${college.placementRate}%`} />
                <CompareMetric label="Risk" value={college.riskLevel} />
                <CompareMetric label="Fit score" value={`${Math.round(college.breakdown?.finalRecommendationScore ?? 0)}%`} />
                <CompareMetric label="Admission probability" value={`${Math.round(college.breakdown?.admissionProbability ?? 0)}%`} />
                <CompareMetric label="ROI score" value={`${Math.round(college.breakdown?.roiScore ?? 0)}%`} />
                <CompareMetric label="Top roles" value={college.breakdown?.roleOutcomes.slice(0, 2).join(", ") ?? "MBA roles"} span />
              </div>
              <Link href={`/portal/colleges/${college.slug}`} className="inline-block w-full">
                <Button className="w-full" variant="outline">Open detail</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompareMetric({ label, value, span = false }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={`rounded-2xl bg-muted/30 p-3 ${span ? "col-span-2" : ""}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}
