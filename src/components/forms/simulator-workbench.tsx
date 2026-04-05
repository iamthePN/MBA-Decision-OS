"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { fundingModeOptions, riskAppetiteOptions } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const scenarioColors = ["#166534", "#f59e0b", "#0f766e"];

export function SimulatorWorkbench({
  colleges,
  defaultCollegeId,
  defaultSpecialization,
  defaultRisk,
  defaultFundingMode,
  defaultRole
}: {
  colleges: Array<{
    id: string;
    name: string;
    totalFees: number;
    livingCostAnnual: number;
    averageSalary: number;
    medianSalary: number;
    paybackPeriod: number;
    placementRate: number;
    riskLevel: string;
    specializations: string[];
    topRoles: string[];
  }>;
  defaultCollegeId?: string;
  defaultSpecialization?: string;
  defaultRisk?: "LOW" | "MEDIUM" | "HIGH";
  defaultFundingMode?: "SELF_FUNDED" | "EDUCATION_LOAN" | "SCHOLARSHIP" | "HYBRID";
  defaultRole?: string;
}) {
  const [collegeId, setCollegeId] = useState(defaultCollegeId ?? colleges[0]?.id ?? "");
  const [specialization, setSpecialization] = useState(defaultSpecialization ?? colleges[0]?.specializations[0] ?? "Marketing");
  const [riskAppetite, setRiskAppetite] = useState(defaultRisk ?? "MEDIUM");
  const [fundingMode, setFundingMode] = useState(defaultFundingMode ?? "SELF_FUNDED");
  const [rolePath, setRolePath] = useState(defaultRole ?? colleges[0]?.topRoles[0] ?? "Associate Consultant");

  const selectedCollege = useMemo(() => colleges.find((college) => college.id === collegeId) ?? colleges[0], [collegeId, colleges]);

  const scenario = useMemo(() => {
    if (!selectedCollege) {
      return null;
    }

    const tuition = selectedCollege.totalFees;
    const living = selectedCollege.livingCostAnnual * 2;
    const fundingOffset = fundingMode === "SCHOLARSHIP" ? 0.2 : fundingMode === "HYBRID" ? 0.1 : 0;
    const totalInvestment = (tuition + living) * (1 - fundingOffset);
    const placementProbability = Math.max(35, Math.min(99, selectedCollege.placementRate + (riskAppetite === "HIGH" ? -3 : riskAppetite === "LOW" ? 3 : 0)));
    const expectedCtc = selectedCollege.averageSalary * (specialization.toLowerCase().includes("analytics") ? 1.05 : 1);
    const threeYearEarnings = expectedCtc * 3.05;
    const fiveYearEarnings = expectedCtc * 5.7;
    const safe = Math.round(expectedCtc * 0.78);
    const balanced = Math.round(expectedCtc * 0.98);
    const highRisk = Math.round(expectedCtc * 1.2);

    return {
      tuition,
      living,
      totalInvestment,
      placementProbability,
      expectedCtc,
      ctcRange: [Math.round(expectedCtc * 0.85), Math.round(expectedCtc * 1.15)],
      threeYearEarnings,
      fiveYearEarnings,
      paybackPeriod: Math.max(0.8, totalInvestment / Math.max(expectedCtc, 1)),
      roleLikelihood: [
        { name: rolePath, value: 44 },
        { name: "Analytics", value: specialization.toLowerCase().includes("analytics") ? 26 : 18 },
        { name: "Product", value: 18 },
        { name: "Finance", value: 12 }
      ],
      scenarios: [
        { name: "Safe", value: safe },
        { name: "Balanced", value: balanced },
        { name: "High-risk", value: highRisk }
      ]
    };
  }, [fundingMode, riskAppetite, rolePath, selectedCollege, specialization]);

  if (!selectedCollege || !scenario) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <Label>College</Label>
            <Select value={collegeId} onChange={(event) => setCollegeId(event.target.value)}>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>{college.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Specialization</Label>
            <Select value={specialization} onChange={(event) => setSpecialization(event.target.value)}>
              {selectedCollege.specializations.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Risk appetite</Label>
            <Select value={riskAppetite} onChange={(event) => setRiskAppetite(event.target.value as typeof riskAppetite)}>
              {riskAppetiteOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Funding mode</Label>
            <Select value={fundingMode} onChange={(event) => setFundingMode(event.target.value as typeof fundingMode)}>
              {fundingModeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Expected role path</Label>
            <Select value={rolePath} onChange={(event) => setRolePath(event.target.value)}>
              {selectedCollege.topRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-4">
        {[
          { label: "Estimated tuition cost", value: formatCurrency(scenario.tuition) },
          { label: "Living expense", value: formatCurrency(scenario.living) },
          { label: "Total investment", value: formatCurrency(scenario.totalInvestment) },
          { label: "Placement probability", value: `${scenario.placementProbability}%` },
          { label: "Expected CTC range", value: `${formatCurrency(scenario.ctcRange[0])} - ${formatCurrency(scenario.ctcRange[1])}` },
          { label: "3-year earnings", value: formatCurrency(scenario.threeYearEarnings) },
          { label: "5-year earnings", value: formatCurrency(scenario.fiveYearEarnings) },
          { label: "Payback period", value: `${scenario.paybackPeriod.toFixed(1)} years` }
        ].map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <Card>
              <CardContent className="space-y-2 p-6">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <p className="mb-4 text-lg font-semibold">Outcome scenario projections</p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenario.scenarios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbe4ef" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {scenario.scenarios.map((entry, index) => (
                      <Cell key={entry.name} fill={scenarioColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="mb-4 text-lg font-semibold">Role likelihood by category</p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={scenario.roleLikelihood} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {scenario.roleLikelihood.map((entry, index) => (
                      <Cell key={entry.name} fill={scenarioColors[index % scenarioColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
