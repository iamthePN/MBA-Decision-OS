import { PrismaClient } from "@prisma/client";

import { upsertCollege } from "../src/lib/admin";
import { hashPassword } from "../src/lib/auth/password";
import { collegeInclude, profileInclude } from "../src/lib/data";
import { defaultScoringWeights } from "../src/lib/scoring/default-weights";
import { evaluateRecommendation } from "../src/lib/scoring/engine";

const prisma = new PrismaClient();

const examTypes = [
  ["CAT", "Common Admission Test", 100, 85],
  ["XAT", "Xavier Aptitude Test", 100, 80],
  ["GMAT", "Graduate Management Admission Test", 800, 650],
  ["NMAT", "NMAT by GMAC", 360, 225],
  ["SNAP", "SNAP Test", 100, 75],
  ["MAT", "Management Aptitude Test", 100, 70],
  ["GRE", "Graduate Record Examination", 340, 315]
] as const;

const pricingPlans = [
  {
    name: "Free",
    slug: "free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Profile evaluation, sample recommendations, and one compare workflow.",
    features: ["Basic profile builder", "Top recommendations", "Compare workspace", "Printable summary"],
    ctaLabel: "Start free",
    highlighted: false
  },
  {
    name: "Pro",
    slug: "pro",
    priceMonthly: 2499,
    priceYearly: 23999,
    description: "Full recommendation engine, ROI simulator, exports, and application tracking.",
    features: ["Unlimited recommendations", "Career simulator", "Application tracker", "CSV exports", "Printable report"],
    ctaLabel: "Upgrade to Pro",
    highlighted: true
  },
  {
    name: "Counselor / Institution",
    slug: "counselor-institution",
    priceMonthly: 14999,
    priceYearly: 149999,
    description: "Admin controls, portfolio oversight, and catalog management.",
    features: ["Admin dashboard", "CSV import", "Editable scoring weights", "Pipeline visibility", "Content management"],
    ctaLabel: "Talk to sales",
    highlighted: false
  }
];

const testimonials = [
  ["Ananya Rao", "Product Analyst", "ISB Candidate", "I stopped choosing schools on brand alone. The payback and role-quality view completely changed my shortlist.", "Focused on stronger ROI paths."],
  ["Karan Malhotra", "Consulting Aspirant", "IIM Targeting Applicant", "The explainability made the recommendations feel trustworthy. I could see exactly why each school ranked where it did.", "Improved application sequencing."],
  ["Meera Shah", "Marketing Lead", "Executive MBA Explorer", "The risk meter stopped me from overcommitting to a financially stretched option.", "Balanced ambition with budget reality."],
  ["Rohit Jain", "Operations Manager", "Beta User", "The simulator made long-term outcomes tangible. It felt more like planning a portfolio than browsing education ads.", "Shifted to outcome-first decision making."]
] as const;

const collegeBases = [
  ["IIM Ahmedabad PGP", "iim-ahmedabad-pgp", "Ahmedabad", 2650000, 3450000, "ASPIRATIONAL", "PUBLIC", ["CAT", "GMAT"], ["Consulting", "Finance", "Marketing", "Operations"]],
  ["IIM Bangalore PGP", "iim-bangalore-pgp", "Bengaluru", 2570000, 3380000, "ASPIRATIONAL", "PUBLIC", ["CAT", "GMAT"], ["Product", "Consulting", "Business Analytics", "Marketing"]],
  ["IIM Calcutta MBA", "iim-calcutta-mba", "Kolkata", 2550000, 3500000, "ASPIRATIONAL", "PUBLIC", ["CAT", "GMAT"], ["Finance", "Consulting", "Business Analytics", "Operations"]],
  ["ISB Hyderabad PGP", "isb-hyderabad-pgp", "Hyderabad", 4100000, 3400000, "BALANCED", "PRIVATE", ["GMAT", "GRE"], ["Consulting", "Product", "Marketing", "Finance"]],
  ["XLRI BM", "xlri-bm", "Jamshedpur", 2980000, 2950000, "BALANCED", "PRIVATE", ["XAT", "GMAT"], ["Consulting", "HR", "Marketing", "Finance"]],
  ["FMS Delhi MBA", "fms-delhi-mba", "Delhi", 240000, 3430000, "ASPIRATIONAL", "PUBLIC", ["CAT"], ["Consulting", "Marketing", "Finance", "Operations"]],
  ["SPJIMR PGDM", "spjimr-pgdm", "Mumbai", 2400000, 2800000, "BALANCED", "PRIVATE", ["CAT", "GMAT"], ["Marketing", "Finance", "Operations", "Product"]],
  ["MDI Gurgaon PGDM", "mdi-gurgaon-pgdm", "Gurugram", 2520000, 2750000, "BALANCED", "PRIVATE", ["CAT", "GMAT"], ["Consulting", "Operations", "HR", "Marketing"]],
  ["IIFT Delhi MBA IB", "iift-delhi-mba-ib", "Delhi", 2100000, 2650000, "BALANCED", "PUBLIC", ["CAT", "GMAT"], ["Marketing", "Finance", "Operations", "Consulting"]],
  ["NMIMS Mumbai MBA", "nmims-mumbai-mba", "Mumbai", 2450000, 2250000, "BALANCED", "PRIVATE", ["NMAT", "GMAT"], ["Finance", "Marketing", "HR", "Operations"]],
  ["SIBM Pune MBA", "sibm-pune-mba", "Pune", 2360000, 2050000, "BALANCED", "PRIVATE", ["SNAP"], ["Marketing", "HR", "Finance", "Operations"]],
  ["SCMHRD Pune MBA", "scmhrd-pune-mba", "Pune", 2250000, 1950000, "BALANCED", "PRIVATE", ["SNAP"], ["HR", "Business Analytics", "Operations", "Marketing"]],
  ["IMT Ghaziabad PGDM", "imt-ghaziabad-pgdm", "Ghaziabad", 2090000, 1800000, "BALANCED", "PRIVATE", ["CAT", "XAT", "GMAT"], ["Marketing", "Finance", "HR", "Operations"]],
  ["IIM Kozhikode PGP", "iim-kozhikode-pgp", "Kozhikode", 2320000, 2860000, "BALANCED", "PUBLIC", ["CAT", "GMAT"], ["Consulting", "Marketing", "Business Analytics", "Product"]],
  ["IIM Indore PGP", "iim-indore-pgp", "Indore", 2130000, 2570000, "BALANCED", "PUBLIC", ["CAT", "GMAT"], ["Consulting", "Marketing", "Business Analytics", "Operations"]],
  ["Great Lakes Chennai PGPM", "great-lakes-chennai-pgpm", "Chennai", 1860000, 1760000, "BALANCED", "PRIVATE", ["CAT", "GMAT", "XAT"], ["Business Analytics", "Operations", "Product", "Marketing"]],
  ["TAPMI Manipal MBA", "tapmi-manipal-mba", "Manipal", 1900000, 1700000, "SAFE", "PRIVATE", ["CAT", "XAT", "GMAT"], ["Finance", "Marketing", "HR", "Operations"]],
  ["XIMB BM", "ximb-bm", "Bhubaneswar", 1950000, 1850000, "SAFE", "PRIVATE", ["XAT", "CAT", "GMAT"], ["Consulting", "HR", "Marketing", "Operations"]],
  ["JBIMS MMS", "jbims-mms", "Mumbai", 620000, 2860000, "ASPIRATIONAL", "PUBLIC", ["CAT", "XAT", "GMAT"], ["Finance", "Consulting", "Marketing", "Operations"]],
  ["BITSOM MBA", "bitsom-mba", "Mumbai", 2480000, 2250000, "BALANCED", "PRIVATE", ["CAT", "GMAT", "GRE"], ["Product", "Consulting", "Marketing", "Business Analytics"]]
] as const;

const recruiterPool = ["McKinsey", "BCG", "Bain & Company", "Deloitte", "Accenture", "Amazon", "Microsoft", "Goldman Sachs", "HUL", "PwC", "EY", "KPMG"];
const sectorPool = ["Consulting", "Finance", "Technology", "Product", "Analytics", "Operations", "Consumer", "HR"];

const studentProfiles = [
  {
    name: "Demo Student",
    email: "student@mbadecisionos.dev",
    password: "Student@12345",
    exam: ["CAT", 96, 97.2],
    profile: ["India", "NIT Trichy", "B.Tech Mechanical Engineering", 91, 88, 79, 30, "Senior Business Analyst", false, 2027],
    goals: ["Move into consulting or product strategy with stronger leadership exposure.", "Build toward a senior operating role with strong compensation and international mobility."],
    industries: ["Consulting", "Product", "Analytics"],
    preference: ["Product", "Bengaluru", 1000000, 2800000, "MEDIUM", "SELF_FUNDED", "Product Manager", ["Consulting", "Product", "Technology"]],
    achievements: [["LEADERSHIP", "Led cross-functional automation initiative"], ["EXTRACURRICULAR", "National case competition finalist"], ["CERTIFICATION", "Product Strategy Certification"], ["INTERNSHIP", "Operations internship at Tata Steel"]]
  },
  {
    name: "Ananya Mehta",
    email: "ananya@mbadecisionos.dev",
    password: "Student@12345",
    exam: ["XAT", 89, 95],
    profile: ["India", "St. Xavier's College", "B.Com", 93, 92, 82, 24, "Brand Executive", true, 2027],
    goals: ["Switch into a stronger brand management or consulting role.", "Lead consumer growth strategy in a global brand portfolio."],
    industries: ["Marketing", "Consumer", "Consulting"],
    preference: ["Marketing", "Mumbai", 500000, 2000000, "LOW", "SCHOLARSHIP", "Brand Manager", ["Consumer", "Marketing", "Consulting"]],
    achievements: [["EXTRACURRICULAR", "College fest marketing lead"], ["CERTIFICATION", "Digital Marketing Professional"], ["INTERNSHIP", "Summer intern at P&G"]]
  },
  {
    name: "Rahul Bansal",
    email: "rahul@mbadecisionos.dev",
    password: "Student@12345",
    exam: ["GMAT", 690, 89],
    profile: ["India", "VIT Vellore", "B.Tech Computer Science", 86, 84, 76, 20, "Growth Analyst", false, 2028],
    goals: ["Move into analytics or product growth roles post MBA.", "Lead data-driven growth teams in technology businesses."],
    industries: ["Analytics", "Product", "Technology"],
    preference: ["Business Analytics", "Hyderabad", 1200000, 2600000, "MEDIUM", "HYBRID", "Analytics Consultant", ["Analytics", "Technology", "Product"]],
    achievements: [["LEADERSHIP", "Scaled startup growth experiment program"], ["CERTIFICATION", "Google Data Analytics Certificate"]]
  }
] as const;

function buildCollegePayload(base: (typeof collegeBases)[number], index: number) {
  const [name, slug, city, totalFees, averageSalary, riskLevel, type, acceptedExamCodes, specializationNames] = base;
  const livingCostAnnual = city === "Mumbai" ? 500000 : city === "Bengaluru" ? 420000 : 300000;
  const medianSalary = Math.round(averageSalary * 0.92);
  const highestSalary = Math.round(averageSalary * 1.8);
  const placementRate = riskLevel === "SAFE" ? 88 + (index % 4) : riskLevel === "BALANCED" ? 92 + (index % 5) : 98;
  const paybackPeriod = Number(((totalFees + livingCostAnnual * 2) / averageSalary).toFixed(1));
  const recruiters = recruiterPool.slice(index % 4, (index % 4) + 5);
  const sectors = sectorPool.slice(index % 3, (index % 3) + 4);
  const topRoles = specializationNames.slice(0, 3).map((item) => {
    if (item === "Consulting") return "Associate Consultant";
    if (item === "Product") return "Product Manager";
    if (item === "Finance") return "Finance Associate";
    if (item === "Business Analytics") return "Business Analyst";
    if (item === "HR") return "HR Manager";
    if (item === "Marketing") return "Brand Manager";
    return `${item} Lead`;
  });

  return {
    name,
    slug,
    location: `${city}, India`,
    city,
    country: "India",
    overview: `${name} is seeded as a high-credibility MBA option inside the demo catalog, optimized for outcome-first decision making across ROI, placements, and career trajectory.`,
    totalFees,
    livingCostAnnual,
    averageSalary,
    medianSalary,
    highestSalary,
    placementRate,
    paybackPeriod,
    intakeSize: 180 + index * 12,
    durationMonths: name.includes("PGP") || name.includes("MBA") || name.includes("PGDM") || name.includes("MMS") ? 24 : 12,
    type,
    riskLevel,
    rankingNote: index < 6 ? "Featured flagship" : "Seeded demo program",
    website: `https://example.com/${slug}`,
    logoText: name.replace(/[^A-Z]/g, "").slice(0, 4) || name.slice(0, 3).toUpperCase(),
    featured: index < 6,
    acceptedExamCodes: [...acceptedExamCodes],
    specializationNames: [...specializationNames],
    recruiterNames: recruiters,
    sectorNames: sectors,
    topRoles,
    consultingShare: specializationNames.includes("Consulting") ? 24 : 12,
    financeShare: specializationNames.includes("Finance") ? 22 : 10,
    analyticsShare: specializationNames.includes("Business Analytics") ? 20 : 10,
    productShare: specializationNames.includes("Product") ? 18 : 8,
    operationsShare: specializationNames.includes("Operations") ? 16 : 10,
    internationalPlacementRate: riskLevel === "ASPIRATIONAL" ? 12 : riskLevel === "BALANCED" ? 6 : 2
  };
}

async function resetDatabase() {
  await prisma.recommendation.deleteMany();
  await prisma.application.deleteMany();
  await prisma.shortlist.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.pricingPlan.deleteMany();
  await prisma.adminSetting.deleteMany();
  await prisma.scoringWeight.deleteMany();
  await prisma.collegeExamAcceptance.deleteMany();
  await prisma.collegeSpecialization.deleteMany();
  await prisma.collegeRecruiter.deleteMany();
  await prisma.collegeSector.deleteMany();
  await prisma.placementStat.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.examScore.deleteMany();
  await prisma.educationRecord.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.college.deleteMany();
  await prisma.examType.deleteMany();
  await prisma.recruiter.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.specialization.deleteMany();
}

async function seedReferenceData() {
  await prisma.examType.createMany({
    data: examTypes.map(([code, name, maxScore, benchmarkScore]) => ({ code, name, maxScore, benchmarkScore, description: `${name} seeded for demo use` }))
  });
  await prisma.scoringWeight.createMany({ data: defaultScoringWeights });
  await prisma.pricingPlan.createMany({ data: pricingPlans });
  await prisma.testimonial.createMany({
    data: testimonials.map(([name, role, program, quote, outcome]) => ({ name, role, program, quote, outcome, featured: true }))
  });
  await prisma.adminSetting.createMany({
    data: [
      { key: "featured_college_limit", value: "6", description: "Maximum featured colleges on landing page" },
      { key: "enable_ai_summaries", value: "false", description: "Optional AI summaries feature flag" },
      { key: "best_roi_provider_claim", value: "true", description: "Marketing positioning toggle" }
    ]
  });
}

async function seedColleges() {
  for (const [index, college] of collegeBases.entries()) {
    await upsertCollege(buildCollegePayload(college, index) as any);
  }
}

async function seedUsersAndProfiles() {
  const specializationCache = new Map((await prisma.specialization.findMany()).map((item) => [item.name, item.id]));

  for (const student of studentProfiles) {
    const user = await prisma.user.create({
      data: {
        name: student.name,
        email: student.email,
        passwordHash: hashPassword(student.password),
        role: "STUDENT"
      }
    });

    const [country, undergradInstitution, undergradDegree, tenthScore, twelfthScore, undergraduateScore, workExperienceMonths, currentJobRole, scholarshipNeed, targetIntakeYear] = student.profile;
    const [shortTermGoals, longTermGoals] = student.goals;

    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        country,
        academicHistory: `${undergradDegree} graduate with outcome-first MBA intent.`,
        undergradInstitution,
        undergradDegree,
        tenthScore,
        twelfthScore,
        undergraduateScore,
        workExperienceMonths,
        currentJobRole,
        profileCompletion: 100,
        scholarshipNeed,
        targetIntakeYear,
        shortTermGoals,
        longTermGoals,
        preferredIndustries: [...student.industries]
      }
    });

    await prisma.educationRecord.createMany({
      data: [
        { studentProfileId: profile.id, level: "10th", institution: "School Record", score: tenthScore },
        { studentProfileId: profile.id, level: "12th", institution: "School Record", score: twelfthScore },
        { studentProfileId: profile.id, level: "Undergraduate", institution: undergradInstitution, specialization: undergradDegree, score: undergraduateScore }
      ]
    });

    const examType = await prisma.examType.findUniqueOrThrow({ where: { code: student.exam[0] } });
    await prisma.examScore.create({
      data: {
        studentProfileId: profile.id,
        examTypeId: examType.id,
        score: student.exam[1],
        percentile: student.exam[2]
      }
    });

    await prisma.workExperience.create({
      data: {
        studentProfileId: profile.id,
        company: "Demo Employer",
        role: currentJobRole,
        industry: student.industries[0],
        durationMonths: workExperienceMonths,
        isCurrent: true,
        summary: currentJobRole
      }
    });

    await prisma.achievement.createMany({
      data: student.achievements.map(([type, title]) => ({ studentProfileId: profile.id, type: type as any, title }))
    });

    const [specialization, preferredLocation, budgetMin, budgetMax, riskAppetite, fundingMode, targetRole, preferredSectors] = student.preference;
    await prisma.preference.create({
      data: {
        studentProfileId: profile.id,
        specializationId: specializationCache.get(specialization)!,
        preferredLocation,
        budgetMin,
        budgetMax,
        riskAppetite: riskAppetite as any,
        fundingMode: fundingMode as any,
        targetRole,
        preferredSectors: [...preferredSectors]
      }
    });
  }

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@mbadecisionos.dev",
      passwordHash: hashPassword("Admin@12345"),
      role: "ADMIN"
    }
  });
}

async function seedOperationalData() {
  const demoUser = await prisma.user.findUniqueOrThrow({ where: { email: "student@mbadecisionos.dev" } });
  const colleges = await prisma.college.findMany({ include: collegeInclude });
  const shortlistIds = colleges.slice(0, 3).map((college) => college.id);

  await prisma.shortlist.createMany({
    data: shortlistIds.map((collegeId) => ({ userId: demoUser.id, collegeId }))
  });

  await prisma.application.createMany({
    data: [
      { userId: demoUser.id, collegeId: colleges[0].id, status: "SUBMITTED", deadline: new Date("2026-11-30"), feesPaid: 2500, nextStep: "Prepare interview stories", note: "Flagship target" },
      { userId: demoUser.id, collegeId: colleges[1].id, status: "INTERVIEW", deadline: new Date("2026-12-10"), feesPaid: 3000, nextStep: "Mock case interview", note: "Great product ecosystem" }
    ]
  });

  await prisma.contactMessage.createMany({
    data: [
      { name: "Priya Singh", email: "priya@example.com", subject: "Need help with ROI modeling", message: "I want help comparing a one-year MBA against a two-year Indian MBA.", status: "NEW" },
      { name: "Counselor Demo", email: "counselor@example.com", subject: "Institution plan enquiry", message: "We are evaluating the counselor plan for a pilot deployment.", status: "REVIEWED" }
    ]
  });

  const users = await prisma.user.findMany({ where: { role: "STUDENT" } });
  const weights = defaultScoringWeights.map((item) => ({ key: item.key, value: item.value }));

  for (const user of users) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: user.id }, include: profileInclude });
    if (!profile) continue;

    const topRecommendations = colleges
      .map((college) => ({ college, result: evaluateRecommendation(profile as any, college as any, weights) }))
      .sort((left, right) => right.result.finalRecommendationScore - left.result.finalRecommendationScore)
      .slice(0, 5);

    await prisma.recommendation.createMany({
      data: topRecommendations.map((item) => ({
        userId: user.id,
        collegeId: item.college.id,
        finalScore: item.result.finalRecommendationScore,
        matchScore: item.result.collegeMatchScore,
        admissionProbability: item.result.admissionProbability,
        roiScore: item.result.roiScore,
        placementScore: item.result.placementStrengthScore,
        careerAlignmentScore: item.result.careerAlignmentScore,
        riskCompatibilityScore: item.result.riskCompatibilityScore,
        reason: item.result.explainability
      }))
    });
  }
}

async function main() {
  await resetDatabase();
  await seedReferenceData();
  await seedColleges();
  await seedUsersAndProfiles();
  await seedOperationalData();
  console.info("MBA Decision OS seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
