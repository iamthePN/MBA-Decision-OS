import { type Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { collegeInclude } from "@/lib/data";

export type CollegePayload = {
  id?: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  country: string;
  overview: string;
  totalFees: number;
  livingCostAnnual: number;
  averageSalary: number;
  medianSalary: number;
  highestSalary: number;
  placementRate: number;
  paybackPeriod: number;
  intakeSize: number;
  durationMonths: number;
  type: "PRIVATE" | "PUBLIC" | "AUTONOMOUS" | "GLOBAL";
  riskLevel: "SAFE" | "BALANCED" | "ASPIRATIONAL";
  rankingNote?: string | null;
  website?: string | null;
  logoText: string;
  featured: boolean;
  acceptedExamCodes: string[];
  specializationNames: string[];
  recruiterNames: string[];
  sectorNames: string[];
  topRoles: string[];
  consultingShare: number;
  financeShare: number;
  analyticsShare: number;
  productShare: number;
  operationsShare: number;
  internationalPlacementRate: number;
};

async function ensureNamedEntities<T extends { name: string }>(
  values: string[],
  findMany: (names: string[]) => Promise<T[]>,
  create: (name: string) => Promise<T>
) {
  const uniqueValues = Array.from(new Set(values.filter(Boolean)));
  const existing = await findMany(uniqueValues);
  const existingNames = new Set(existing.map((item) => item.name));

  for (const value of uniqueValues) {
    if (!existingNames.has(value)) {
      await create(value);
    }
  }
}

export async function upsertCollege(payload: CollegePayload) {
  await ensureNamedEntities(
    payload.specializationNames,
    (names) => prisma.specialization.findMany({ where: { name: { in: names } } }),
    (name) => prisma.specialization.create({ data: { name, description: `${name} catalog entry` } })
  );
  await ensureNamedEntities(
    payload.recruiterNames,
    (names) => prisma.recruiter.findMany({ where: { name: { in: names } } }),
    (name) =>
      prisma.recruiter.create({
        data: { name, description: `${name} catalog entry`, category: "Employer" }
      })
  );
  await ensureNamedEntities(
    payload.sectorNames,
    (names) => prisma.sector.findMany({ where: { name: { in: names } } }),
    (name) => prisma.sector.create({ data: { name, description: `${name} catalog entry` } })
  );

  const examCodes = Array.from(new Set(payload.acceptedExamCodes));
  const exams = await prisma.examType.findMany({ where: { code: { in: examCodes } } });
  for (const code of examCodes) {
    if (!exams.find((exam) => exam.code === code)) {
      await prisma.examType.create({
        data: {
          code,
          name: code,
          maxScore: code === "GMAT" ? 800 : 100,
          benchmarkScore: code === "GMAT" ? 650 : 80,
          description: `${code} seeded by admin import`
        }
      });
    }
  }

  const [specializations, recruiters, sectors, acceptedExams] = await Promise.all([
    prisma.specialization.findMany({ where: { name: { in: payload.specializationNames } } }),
    prisma.recruiter.findMany({ where: { name: { in: payload.recruiterNames } } }),
    prisma.sector.findMany({ where: { name: { in: payload.sectorNames } } }),
    prisma.examType.findMany({ where: { code: { in: payload.acceptedExamCodes } } })
  ]);

  const college = await prisma.college.upsert({
    where: payload.id ? { id: payload.id } : { slug: payload.slug },
    update: {
      name: payload.name,
      slug: payload.slug,
      location: payload.location,
      city: payload.city,
      country: payload.country,
      overview: payload.overview,
      totalFees: payload.totalFees,
      livingCostAnnual: payload.livingCostAnnual,
      averageSalary: payload.averageSalary,
      medianSalary: payload.medianSalary,
      highestSalary: payload.highestSalary,
      placementRate: payload.placementRate,
      paybackPeriod: payload.paybackPeriod,
      intakeSize: payload.intakeSize,
      durationMonths: payload.durationMonths,
      type: payload.type,
      riskLevel: payload.riskLevel,
      rankingNote: payload.rankingNote,
      website: payload.website,
      logoText: payload.logoText,
      featured: payload.featured
    },
    create: {
      name: payload.name,
      slug: payload.slug,
      location: payload.location,
      city: payload.city,
      country: payload.country,
      overview: payload.overview,
      totalFees: payload.totalFees,
      livingCostAnnual: payload.livingCostAnnual,
      averageSalary: payload.averageSalary,
      medianSalary: payload.medianSalary,
      highestSalary: payload.highestSalary,
      placementRate: payload.placementRate,
      paybackPeriod: payload.paybackPeriod,
      intakeSize: payload.intakeSize,
      durationMonths: payload.durationMonths,
      type: payload.type,
      riskLevel: payload.riskLevel,
      rankingNote: payload.rankingNote,
      website: payload.website,
      logoText: payload.logoText,
      featured: payload.featured
    }
  });

  await Promise.all([
    prisma.collegeExamAcceptance.deleteMany({ where: { collegeId: college.id } }),
    prisma.collegeSpecialization.deleteMany({ where: { collegeId: college.id } }),
    prisma.collegeRecruiter.deleteMany({ where: { collegeId: college.id } }),
    prisma.collegeSector.deleteMany({ where: { collegeId: college.id } })
  ]);

  await prisma.placementStat.upsert({
    where: { collegeId: college.id },
    update: {
      averageSalary: payload.averageSalary,
      medianSalary: payload.medianSalary,
      highestSalary: payload.highestSalary,
      placementRate: payload.placementRate,
      consultingShare: payload.consultingShare,
      financeShare: payload.financeShare,
      analyticsShare: payload.analyticsShare,
      productShare: payload.productShare,
      operationsShare: payload.operationsShare,
      internationalPlacementRate: payload.internationalPlacementRate,
      topRoles: payload.topRoles
    },
    create: {
      collegeId: college.id,
      averageSalary: payload.averageSalary,
      medianSalary: payload.medianSalary,
      highestSalary: payload.highestSalary,
      placementRate: payload.placementRate,
      consultingShare: payload.consultingShare,
      financeShare: payload.financeShare,
      analyticsShare: payload.analyticsShare,
      productShare: payload.productShare,
      operationsShare: payload.operationsShare,
      internationalPlacementRate: payload.internationalPlacementRate,
      topRoles: payload.topRoles
    }
  });

  if (acceptedExams.length) {
    await prisma.collegeExamAcceptance.createMany({
      data: acceptedExams.map((exam) => ({
        collegeId: college.id,
        examTypeId: exam.id,
        minScore: exam.benchmarkScore * 0.85,
        typicalScore: exam.benchmarkScore
      }))
    });
  }

  if (specializations.length) {
    await prisma.collegeSpecialization.createMany({
      data: specializations.map((specialization, index) => ({
        collegeId: college.id,
        specializationId: specialization.id,
        strength: Math.max(64, 92 - index * 5)
      }))
    });
  }

  if (recruiters.length) {
    await prisma.collegeRecruiter.createMany({
      data: recruiters.map((recruiter) => ({
        collegeId: college.id,
        recruiterId: recruiter.id
      }))
    });
  }

  if (sectors.length) {
    await prisma.collegeSector.createMany({
      data: sectors.map((sector, index) => ({
        collegeId: college.id,
        sectorId: sector.id,
        hiringStrength: Math.max(60, 90 - index * 6)
      }))
    });
  }

  const hydrated = await prisma.college.findUniqueOrThrow({
    where: { id: college.id },
    include: collegeInclude
  });

  return serializeCollege(hydrated);
}

type HydratedCollege = Prisma.CollegeGetPayload<{
  include: typeof collegeInclude;
}>;

export function serializeCollege(college: HydratedCollege) {
  return {
    id: college.id,
    slug: college.slug,
    name: college.name,
    location: college.location,
    city: college.city,
    country: college.country,
    overview: college.overview,
    totalFees: college.totalFees,
    livingCostAnnual: college.livingCostAnnual,
    averageSalary: college.averageSalary,
    medianSalary: college.medianSalary,
    highestSalary: college.highestSalary,
    placementRate: college.placementRate,
    paybackPeriod: college.paybackPeriod,
    intakeSize: college.intakeSize,
    durationMonths: college.durationMonths,
    type: college.type,
    riskLevel: college.riskLevel,
    rankingNote: college.rankingNote,
    website: college.website,
    logoText: college.logoText,
    featured: college.featured,
    examCodes: college.examAcceptances?.map((item) => item.examType.code) ?? [],
    specializations: college.specializations?.map((item) => item.specialization.name) ?? [],
    recruiters: college.recruiters?.map((item) => item.recruiter.name) ?? [],
    sectors: college.sectors?.map((item) => item.sector.name) ?? [],
    topRoles: college.placementStat?.topRoles ?? [],
    consultingShare: college.placementStat?.consultingShare ?? 0,
    financeShare: college.placementStat?.financeShare ?? 0,
    analyticsShare: college.placementStat?.analyticsShare ?? 0,
    productShare: college.placementStat?.productShare ?? 0,
    operationsShare: college.placementStat?.operationsShare ?? 0,
    internationalPlacementRate: college.placementStat?.internationalPlacementRate ?? 0
  };
}

