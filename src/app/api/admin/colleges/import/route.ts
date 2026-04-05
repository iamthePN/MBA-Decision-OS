import Papa from "papaparse";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { serializeCollege, upsertCollege } from "@/lib/admin";
import { authOptions } from "@/lib/auth/options";
import { collegeInclude } from "@/lib/data";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "CSV file is required" }, { status: 400 });
  }

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });

  for (const row of parsed.data) {
    if (!row.name) continue;
    await upsertCollege({
      name: row.name,
      slug: row.slug || slugify(row.name),
      location: row.location || row.city || "India",
      city: row.city || row.location || "City",
      country: row.country || "India",
      overview: row.overview || `${row.name} seeded from CSV import.`,
      totalFees: Number(row.totalFees || row.fees || 1800000),
      livingCostAnnual: Number(row.livingCostAnnual || 350000),
      averageSalary: Number(row.averageSalary || row.avgPackage || 1800000),
      medianSalary: Number(row.medianSalary || row.medianPackage || 1600000),
      highestSalary: Number(row.highestSalary || row.highestPackage || 3000000),
      placementRate: Number(row.placementRate || 90),
      paybackPeriod: Number(row.paybackPeriod || 2.2),
      intakeSize: Number(row.intakeSize || 240),
      durationMonths: Number(row.durationMonths || 24),
      type: (row.type as "PRIVATE" | "PUBLIC" | "AUTONOMOUS" | "GLOBAL") || "PRIVATE",
      riskLevel: (row.riskLevel as "SAFE" | "BALANCED" | "ASPIRATIONAL") || "BALANCED",
      rankingNote: row.rankingNote || "Imported",
      website: row.website || "",
      logoText: row.logoText || row.name.slice(0, 3).toUpperCase(),
      featured: row.featured === "true",
      acceptedExamCodes: (row.acceptedExamCodes || row.exams || "CAT,GMAT").split(",").map((item) => item.trim()).filter(Boolean),
      specializationNames: (row.specializations || "Marketing,Finance").split(",").map((item) => item.trim()).filter(Boolean),
      recruiterNames: (row.recruiters || "Deloitte,Accenture").split(",").map((item) => item.trim()).filter(Boolean),
      sectorNames: (row.sectors || "Consulting,Finance").split(",").map((item) => item.trim()).filter(Boolean),
      topRoles: (row.topRoles || "Associate Consultant,Product Manager").split(",").map((item) => item.trim()).filter(Boolean),
      consultingShare: Number(row.consultingShare || 26),
      financeShare: Number(row.financeShare || 18),
      analyticsShare: Number(row.analyticsShare || 16),
      productShare: Number(row.productShare || 14),
      operationsShare: Number(row.operationsShare || 12),
      internationalPlacementRate: Number(row.internationalPlacementRate || 8)
    });
  }

  const colleges = await prisma.college.findMany({ include: collegeInclude, orderBy: { updatedAt: "desc" } });

  return NextResponse.json({ imported: parsed.data.length, colleges: colleges.map((college) => serializeCollege(college)) });
}
