import { type Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { defaultScoringWeights } from "@/lib/scoring/default-weights";
import { evaluateRecommendation } from "@/lib/scoring/engine";
import { slugify } from "@/lib/utils";

export const profileInclude = {
  educationRecords: true,
  examScores: {
    include: {
      examType: true
    }
  },
  workExperiences: true,
  achievements: true,
  preference: {
    include: {
      specialization: true
    }
  }
} satisfies Prisma.StudentProfileInclude;

export const collegeInclude = {
  examAcceptances: {
    include: {
      examType: true
    }
  },
  placementStat: true,
  specializations: {
    include: {
      specialization: {
        select: {
          name: true
        }
      }
    }
  },
  recruiters: {
    include: {
      recruiter: {
        select: {
          name: true,
          category: true
        }
      }
    }
  },
  sectors: {
    include: {
      sector: {
        select: {
          name: true
        }
      }
    }
  }
} satisfies Prisma.CollegeInclude;

export async function getMarketingContent() {
  const [testimonials, pricingPlans, featuredColleges] = await Promise.all([
    prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.pricingPlan.findMany({
      orderBy: { priceMonthly: "asc" }
    }),
    prisma.college.findMany({
      where: { featured: true },
      include: collegeInclude,
      take: 6,
      orderBy: { averageSalary: "desc" }
    })
  ]);

  return { testimonials, pricingPlans, featuredColleges };
}

export async function getStudentProfileByUserId(userId: string) {
  return prisma.studentProfile.findUnique({
    where: { userId },
    include: profileInclude
  });
}

export async function getStudentContext(userId: string) {
  const [user, profile, shortlists, applications, colleges, weights] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getStudentProfileByUserId(userId),
    prisma.shortlist.findMany({
      where: { userId },
      include: {
        college: {
          include: collegeInclude
        }
      }
    }),
    prisma.application.findMany({
      where: { userId },
      include: {
        college: {
          include: collegeInclude
        }
      },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.college.findMany({
      include: collegeInclude,
      orderBy: { averageSalary: "desc" }
    }),
    prisma.scoringWeight.findMany()
  ]);

  return {
    user,
    profile,
    shortlists,
    applications,
    colleges,
    weights: weights.length
      ? weights.map((weight) => ({ key: weight.key, value: weight.value }))
      : defaultScoringWeights.map((weight) => ({ key: weight.key, value: weight.value }))
  };
}

export async function getRecommendationFeed(userId: string, limit = 12) {
  const { profile, colleges, weights } = await getStudentContext(userId);

  if (!profile) {
    return [];
  }

  return colleges
    .map((college) => {
      const breakdown = evaluateRecommendation(profile, college, weights);
      return {
        college,
        ...breakdown
      };
    })
    .sort((left, right) => right.finalRecommendationScore - left.finalRecommendationScore)
    .slice(0, limit);
}

export async function syncRecommendations(userId: string) {
  const recommendations = await getRecommendationFeed(userId, 10);

  await prisma.recommendation.deleteMany({ where: { userId } });

  if (!recommendations.length) {
    return [];
  }

  await prisma.recommendation.createMany({
    data: recommendations.map((recommendation) => ({
      userId,
      collegeId: recommendation.college.id,
      finalScore: recommendation.finalRecommendationScore,
      matchScore: recommendation.collegeMatchScore,
      admissionProbability: recommendation.admissionProbability,
      roiScore: recommendation.roiScore,
      placementScore: recommendation.placementStrengthScore,
      careerAlignmentScore: recommendation.careerAlignmentScore,
      riskCompatibilityScore: recommendation.riskCompatibilityScore,
      reason: recommendation.explainability
    }))
  });

  return recommendations;
}

export async function getDashboardData(userId: string) {
  const context = await getStudentContext(userId);

  if (!context.profile || !context.user) {
    return {
      user: context.user,
      profile: null,
      topRecommendations: [],
      shortlistCount: context.shortlists.length,
      applications: context.applications,
      warnings: [] as Array<{ title: string; body: string; tone: "warning" | "danger" }> 
    };
  }

  const topRecommendations = await getRecommendationFeed(userId, 5);
  const warningCandidates = [
    ...context.shortlists.map((item) => item.college),
    ...topRecommendations.map((item) => item.college)
  ];

  const warnings = warningCandidates
    .map((college) => {
      const score = evaluateRecommendation(context.profile, college, context.weights);

      if (score.roiScore < 55) {
        return {
          title: `Low ROI watch: ${college.name}`,
          body: "This option has a slower payback outlook relative to your current budget and salary expectations.",
          tone: "warning" as const
        };
      }

      if (score.riskCompatibilityScore < 50) {
        return {
          title: `Risk mismatch: ${college.name}`,
          body: "The program sits outside your selected risk appetite and may need a stronger buffer plan.",
          tone: "danger" as const
        };
      }

      return null;
    })
    .filter((item): item is { title: string; body: string; tone: "warning" | "danger" } => Boolean(item))
    .slice(0, 3);

  const headline = topRecommendations[0];

  return {
    user: context.user,
    profile: context.profile,
    topRecommendations,
    shortlistCount: context.shortlists.length,
    applications: context.applications,
    warnings,
    headlineMetrics: {
      profileStrengthScore: headline?.profileStrengthScore ?? 0,
      admissionReadinessScore: headline?.admissionReadinessScore ?? 0,
      roiScore: headline?.roiScore ?? 0
    },
    careerSnapshot: headline
      ? {
          expectedRole: headline.roleOutcomes[0],
          expectedSalary: headline.college.averageSalary,
          paybackEstimate: headline.paybackEstimate
        }
      : null
  };
}

export async function getDiscoveryData(
  userId: string,
  query: {
    search?: string;
    location?: string;
    exam?: string;
    type?: string;
    risk?: string;
    minRoi?: number;
    maxFees?: number;
    page?: number;
    pageSize?: number;
    sort?: string;
  }
) {
  const { profile, weights } = await getStudentContext(userId);
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 9;

  const where: Prisma.CollegeWhereInput = {
    AND: [
      query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { location: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {},
      query.location
        ? {
            location: { contains: query.location, mode: "insensitive" }
          }
        : {},
      query.exam
        ? {
            examAcceptances: {
              some: {
                examType: {
                  code: query.exam
                }
              }
            }
          }
        : {},
      query.type
        ? {
            type: query.type as never
          }
        : {},
      query.risk
        ? {
            riskLevel: query.risk as never
          }
        : {},
      query.maxFees
        ? {
            totalFees: {
              lte: query.maxFees
            }
          }
        : {}
    ]
  };

  const colleges = await prisma.college.findMany({
    where,
    include: collegeInclude
  });

  const enriched = colleges.map((college) => ({
    college,
    breakdown: profile ? evaluateRecommendation(profile, college, weights) : null
  }));

  const filtered = enriched.filter((item) => {
    if (!query.minRoi) return true;
    return (item.breakdown?.roiScore ?? 0) >= query.minRoi;
  });

  const sorted = filtered.sort((left, right) => {
    const sort = query.sort ?? "recommendation";
    if (sort === "fees-asc") return left.college.totalFees - right.college.totalFees;
    if (sort === "salary-desc") return right.college.averageSalary - left.college.averageSalary;
    if (sort === "roi-desc") return (right.breakdown?.roiScore ?? 0) - (left.breakdown?.roiScore ?? 0);
    if (sort === "admission-desc") {
      return (right.breakdown?.admissionProbability ?? 0) - (left.breakdown?.admissionProbability ?? 0);
    }
    return (right.breakdown?.finalRecommendationScore ?? 0) - (left.breakdown?.finalRecommendationScore ?? 0);
  });

  return {
    items: sorted.slice((page - 1) * pageSize, page * pageSize),
    total: sorted.length,
    totalPages: Math.max(1, Math.ceil(sorted.length / pageSize))
  };
}

export async function getCollegeDetail(userId: string, slug: string) {
  const [profile, weights, college] = await Promise.all([
    getStudentProfileByUserId(userId),
    prisma.scoringWeight.findMany(),
    prisma.college.findUnique({
      where: { slug },
      include: collegeInclude
    })
  ]);

  if (!college) {
    return null;
  }

  const weightSet = weights.length
    ? weights.map((weight) => ({ key: weight.key, value: weight.value }))
    : defaultScoringWeights.map((weight) => ({ key: weight.key, value: weight.value }));

  return {
    college,
    breakdown: profile ? evaluateRecommendation(profile, college, weightSet) : null
  };
}

export async function getCompareColleges(userId: string, ids: string[]) {
  const { profile, weights } = await getStudentContext(userId);
  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: collegeInclude
  });

  return colleges.map((college) => ({
    college,
    breakdown: profile ? evaluateRecommendation(profile, college, weights) : null
  }));
}

export async function getAdminOverview() {
  const [users, colleges, contacts, applications, weights, testimonials, pricingPlans, exams, recruiters, sectors] =
    await Promise.all([
      prisma.user.findMany({
        include: {
          studentProfile: true,
          shortlists: true,
          applications: true
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.college.findMany({
        include: collegeInclude,
        orderBy: { updatedAt: "desc" }
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" }
      }),
      prisma.application.findMany({
        include: {
          user: true,
          college: true
        },
        orderBy: { updatedAt: "desc" }
      }),
      prisma.scoringWeight.findMany({
        orderBy: [{ group: "asc" }, { key: "asc" }]
      }),
      prisma.testimonial.findMany({
        orderBy: { createdAt: "asc" }
      }),
      prisma.pricingPlan.findMany({
        orderBy: { priceMonthly: "asc" }
      }),
      prisma.examType.findMany({
        orderBy: { code: "asc" }
      }),
      prisma.recruiter.findMany({
        orderBy: { name: "asc" }
      }),
      prisma.sector.findMany({
        orderBy: { name: "asc" }
      })
    ]);

  return {
    users,
    colleges,
    contacts,
    applications,
    weights,
    testimonials,
    pricingPlans,
    exams,
    recruiters,
    sectors
  };
}

export function buildProfileCompletion(input: {
  country?: string | null;
  undergradInstitution?: string | null;
  undergradDegree?: string | null;
  currentJobRole?: string | null;
  academicHistory?: string | null;
  examTypeCode?: string | null;
  preferredSpecialization?: string | null;
  preferredLocation?: string | null;
  shortTermGoals?: string | null;
  longTermGoals?: string | null;
  preferredIndustries?: string[];
  workExperienceMonths?: number | null;
  targetIntakeYear?: number | null;
}) {
  const checks = [
    Boolean(input.country),
    Boolean(input.undergradInstitution),
    Boolean(input.undergradDegree),
    Boolean(input.currentJobRole),
    Boolean(input.academicHistory),
    Boolean(input.examTypeCode),
    Boolean(input.preferredSpecialization),
    Boolean(input.preferredLocation),
    Boolean(input.shortTermGoals),
    Boolean(input.longTermGoals),
    Boolean(input.preferredIndustries?.length),
    Boolean(input.workExperienceMonths || input.workExperienceMonths === 0),
    Boolean(input.targetIntakeYear)
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function collegeSlug(name: string) {
  return slugify(name);
}


