import { ApplicationStatus, CollegeRiskLevel, CollegeType, FundingMode, RiskAppetite } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(3).max(180),
  message: z.string().min(10).max(2000)
});

export const applicationSchema = z.object({
  collegeId: z.string().cuid(),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.DRAFT),
  deadline: z.string().optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
  feesPaid: z.coerce.number().min(0).max(500000),
  nextStep: z.string().max(200).optional().nullable()
});

export const profileSchema = z.object({
  fullName: z.string().min(2).max(120),
  country: z.string().min(2).max(120),
  academicHistory: z.string().max(1000).optional().nullable(),
  undergradInstitution: z.string().min(2).max(160),
  undergradDegree: z.string().min(2).max(160),
  tenthScore: z.coerce.number().min(0).max(100),
  twelfthScore: z.coerce.number().min(0).max(100),
  undergraduateScore: z.coerce.number().min(0).max(100),
  examTypeCode: z.string().min(2).max(20),
  examScore: z.coerce.number().min(0),
  examPercentile: z.coerce.number().min(0).max(100).optional().nullable(),
  workExperienceMonths: z.coerce.number().min(0).max(240),
  currentJobRole: z.string().max(160).optional().nullable(),
  internships: z.array(z.string().min(2).max(200)).default([]),
  extracurricularAchievements: z.array(z.string().min(2).max(200)).default([]),
  certifications: z.array(z.string().min(2).max(200)).default([]),
  preferredSpecialization: z.string().min(2).max(120),
  preferredLocation: z.string().min(2).max(120),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(100000),
  riskAppetite: z.nativeEnum(RiskAppetite),
  shortTermGoals: z.string().min(10).max(800),
  longTermGoals: z.string().min(10).max(800),
  preferredIndustries: z.array(z.string().min(2).max(100)).min(1),
  scholarshipNeed: z.boolean().default(false),
  targetIntakeYear: z.coerce.number().min(2026).max(2032),
  fundingMode: z.nativeEnum(FundingMode),
  targetRole: z.string().max(120).optional().nullable()
});

export const scoringWeightSchema = z.object({
  key: z.string().min(3),
  value: z.coerce.number().min(0).max(1)
});

export const collegeSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(2).max(180),
  slug: z.string().min(2).max(180),
  location: z.string().min(2).max(120),
  city: z.string().min(2).max(120),
  country: z.string().min(2).max(120),
  overview: z.string().min(20).max(3000),
  totalFees: z.coerce.number().min(100000),
  livingCostAnnual: z.coerce.number().min(0),
  averageSalary: z.coerce.number().min(100000),
  medianSalary: z.coerce.number().min(100000),
  highestSalary: z.coerce.number().min(100000),
  placementRate: z.coerce.number().min(0).max(100),
  paybackPeriod: z.coerce.number().min(0.5).max(10),
  intakeSize: z.coerce.number().min(30).max(2000),
  durationMonths: z.coerce.number().min(6).max(36),
  type: z.nativeEnum(CollegeType),
  riskLevel: z.nativeEnum(CollegeRiskLevel),
  rankingNote: z.string().max(250).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  logoText: z.string().min(1).max(6),
  featured: z.boolean().default(false),
  acceptedExamCodes: z.array(z.string().min(2)).default([]),
  specializationNames: z.array(z.string().min(2)).default([]),
  recruiterNames: z.array(z.string().min(2)).default([]),
  sectorNames: z.array(z.string().min(2)).default([]),
  topRoles: z.array(z.string().min(2)).default([]),
  consultingShare: z.coerce.number().min(0).max(100),
  financeShare: z.coerce.number().min(0).max(100),
  analyticsShare: z.coerce.number().min(0).max(100),
  productShare: z.coerce.number().min(0).max(100),
  operationsShare: z.coerce.number().min(0).max(100),
  internationalPlacementRate: z.coerce.number().min(0).max(100)
});
