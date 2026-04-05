import { AchievementType, FundingMode } from "@prisma/client";

import { average, clamp } from "@/lib/utils";
import { defaultScoringWeights, weightsToMap } from "@/lib/scoring/default-weights";
import {
  appetiteOrder,
  riskLevelOrder,
  type CollegeForScoring,
  type ProfileForScoring,
  type RecommendationBreakdown
} from "@/lib/scoring/types";

type WeightInput = Array<{ key: string; value: number }>;

function normalize(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return clamp(((value - min) / (max - min)) * 100);
}

function scoreBand(value: number) {
  if (value >= 80) return "high";
  if (value >= 60) return "medium";
  return "low";
}

export function calculateProfileStrength(
  profile: ProfileForScoring,
  weightInput: WeightInput = defaultScoringWeights.map(({ key, value }) => ({ key, value }))
) {
  const weights = weightsToMap(weightInput);
  const academics = average([profile.tenthScore, profile.twelfthScore, profile.undergraduateScore]);
  const bestExam = profile.examScores
    .map((exam) => (exam.score / exam.examType.maxScore) * 100)
    .sort((a, b) => b - a)[0] ?? 0;
  const workScore = clamp(100 - Math.abs(profile.workExperienceMonths - 30) * 2.2);
  const achievementsScore = clamp(
    profile.achievements.reduce((sum, item) => {
      if (item.type === AchievementType.LEADERSHIP || item.type === AchievementType.AWARD) return sum + 18;
      if (item.type === AchievementType.CERTIFICATION) return sum + 10;
      return sum + 12;
    }, 0),
    0,
    100
  );
  const goalScore = clamp(
    Math.min(profile.shortTermGoals.length, 160) * 0.3 +
      Math.min(profile.longTermGoals.length, 180) * 0.25,
    0,
    100
  );
  const budgetRealism =
    profile.preference && profile.preference.budgetMax >= 1_000_000 ? 75 : profile.preference ? 55 : 40;

  return clamp(
    academics * weights["profile.academic"] +
      bestExam * weights["profile.exam"] +
      workScore * weights["profile.work"] +
      achievementsScore * weights["profile.achievements"] +
      goalScore * weights["profile.goals"] +
      budgetRealism * weights["profile.budget"]
  );
}

export function calculateBudgetFit(profile: ProfileForScoring, college: CollegeForScoring) {
  const budgetMax = profile.preference?.budgetMax ?? college.totalFees;
  const totalInvestment = college.totalFees + college.livingCostAnnual * 2;

  if (totalInvestment <= budgetMax) return 92;
  if (totalInvestment <= budgetMax * 1.15) return 74;
  if (totalInvestment <= budgetMax * 1.3) return 58;
  return 34;
}

export function calculateLocationFit(profile: ProfileForScoring, college: CollegeForScoring) {
  const preferredLocation = profile.preference?.preferredLocation?.toLowerCase();
  if (!preferredLocation || preferredLocation === "flexible") return 78;
  if (college.location.toLowerCase().includes(preferredLocation)) return 95;
  if (college.city.toLowerCase().includes(preferredLocation)) return 90;
  return 45;
}

export function calculateRiskCompatibility(profile: ProfileForScoring, college: CollegeForScoring) {
  const appetite = profile.preference?.riskAppetite ?? "MEDIUM";
  const delta = Math.abs(appetiteOrder[appetite] - riskLevelOrder[college.riskLevel]);
  return clamp(100 - delta * 28);
}

export function calculatePlacementStrength(college: CollegeForScoring) {
  const placement = college.placementStat;
  if (!placement) return 55;

  return clamp(
    placement.placementRate * 0.45 +
      normalize(placement.averageSalary, 1_000_000, 4_500_000) * 0.3 +
      normalize(placement.medianSalary, 900_000, 3_800_000) * 0.2 +
      normalize(placement.internationalPlacementRate, 0, 25) * 0.05
  );
}

export function calculateCareerAlignment(profile: ProfileForScoring, college: CollegeForScoring) {
  const preferredSectors = new Set(profile.preference?.preferredSectors ?? profile.preferredIndustries);
  const preferredRole = profile.preference?.targetRole?.toLowerCase() ?? "";
  const sectorMatch =
    college.sectors.length === 0
      ? 65
      : clamp(
          (college.sectors.filter((entry) => preferredSectors.has(entry.sector.name)).length /
            Math.max(college.sectors.length, 1)) *
            100 *
            1.7
        );
  const roleMatch =
    college.placementStat?.topRoles.some((role) => role.toLowerCase().includes(preferredRole)) && preferredRole
      ? 90
      : preferredRole
        ? 62
        : 74;
  const recruiterQuality = clamp(college.recruiters.length * 7, 40, 92);

  return clamp(sectorMatch * 0.42 + roleMatch * 0.33 + recruiterQuality * 0.25);
}

export function calculateCollegeMatch(
  profile: ProfileForScoring,
  college: CollegeForScoring,
  weightInput: WeightInput = defaultScoringWeights.map(({ key, value }) => ({ key, value }))
) {
  const weights = weightsToMap(weightInput);
  const preferenceSpecialization = profile.preference?.specializationId;
  const specializationFit = preferenceSpecialization
    ? clamp(
        college.specializations.find((entry) => entry.specializationId === preferenceSpecialization)?.strength ?? 48
      )
    : clamp(average(college.specializations.map((item) => item.strength)) || 68);
  const budgetFit = calculateBudgetFit(profile, college);
  const locationFit = calculateLocationFit(profile, college);
  const placementFit = calculatePlacementStrength(college);
  const sectorFit = calculateCareerAlignment(profile, college);
  const riskFit = calculateRiskCompatibility(profile, college);

  return clamp(
    specializationFit * weights["match.specialization"] +
      locationFit * weights["match.location"] +
      budgetFit * weights["match.budget"] +
      placementFit * weights["match.placement"] +
      sectorFit * weights["match.sector"] +
      riskFit * weights["match.risk"]
  );
}

export function calculateAdmissionProbability(profile: ProfileForScoring, college: CollegeForScoring) {
  const readiness = calculateProfileStrength(profile);
  const bestExamAgainstCollege =
    college.examAcceptances
      .map((acceptance) => {
        const matchingExam = profile.examScores.find((score) => score.examTypeId === acceptance.examTypeId);
        if (!matchingExam) return 35;
        const ratio = matchingExam.score / Math.max(acceptance.typicalScore, 1);
        return clamp(ratio * 85 + 15);
      })
      .sort((a, b) => b - a)[0] ?? 40;

  const selectivityPenalty = college.riskLevel === "ASPIRATIONAL" ? -10 : college.riskLevel === "SAFE" ? 8 : 0;
  return clamp(readiness * 0.55 + bestExamAgainstCollege * 0.35 + selectivityPenalty + 5);
}

export function calculateROIScore(
  profile: ProfileForScoring,
  college: CollegeForScoring,
  weightInput: WeightInput = defaultScoringWeights.map(({ key, value }) => ({ key, value }))
) {
  const weights = weightsToMap(weightInput);
  const placement = college.placementStat;
  const totalInvestment = college.totalFees + college.livingCostAnnual * 2;
  const salaryScore = normalize(college.averageSalary, 1_000_000, 4_500_000);
  const medianScore = normalize(college.medianSalary, 800_000, 3_500_000);
  const costScore = clamp(100 - normalize(totalInvestment, 1_000_000, 5_500_000));
  const paybackScore = clamp(100 - normalize(college.paybackPeriod, 1.2, 5.5));
  const placementRateScore = placement?.placementRate ?? college.placementRate;

  let fundingAdjustment = 0;
  if (profile.preference?.fundingMode === FundingMode.EDUCATION_LOAN) {
    fundingAdjustment = -6;
  } else if (profile.preference?.fundingMode === FundingMode.SCHOLARSHIP) {
    fundingAdjustment = 4;
  }

  if (profile.scholarshipNeed && profile.preference && totalInvestment > profile.preference.budgetMax) {
    fundingAdjustment -= 8;
  }

  return clamp(
    salaryScore * weights["roi.salary"] +
      medianScore * weights["roi.median"] +
      costScore * weights["roi.cost"] +
      paybackScore * weights["roi.payback"] +
      placementRateScore * weights["roi.placement_rate"] +
      fundingAdjustment
  );
}

export function evaluateRecommendation(
  profile: ProfileForScoring,
  college: CollegeForScoring,
  weightInput: WeightInput = defaultScoringWeights.map(({ key, value }) => ({ key, value }))
): RecommendationBreakdown {
  const weights = weightsToMap(weightInput);
  const profileStrengthScore = calculateProfileStrength(profile, weightInput);
  const collegeMatchScore = calculateCollegeMatch(profile, college, weightInput);
  const admissionProbability = calculateAdmissionProbability(profile, college);
  const admissionReadinessScore = clamp(profileStrengthScore * 0.62 + admissionProbability * 0.38);
  const roiScore = calculateROIScore(profile, college, weightInput);
  const placementStrengthScore = calculatePlacementStrength(college);
  const careerAlignmentScore = calculateCareerAlignment(profile, college);
  const riskCompatibilityScore = calculateRiskCompatibility(profile, college);
  const budgetFitScore = calculateBudgetFit(profile, college);
  const locationFitScore = calculateLocationFit(profile, college);
  const finalRecommendationScore = clamp(
    collegeMatchScore * weights["final.profile_fit"] +
      admissionProbability * weights["final.admission"] +
      roiScore * weights["final.roi"] +
      placementStrengthScore * weights["final.placement"] +
      careerAlignmentScore * weights["final.career"] +
      riskCompatibilityScore * weights["final.risk"] +
      budgetFitScore * weights["final.budget"] +
      locationFitScore * weights["final.location"]
  );

  const explainability = buildExplainability({
    profileStrengthScore,
    admissionProbability,
    roiScore,
    riskCompatibilityScore,
    budgetFitScore,
    locationFitScore,
    paybackPeriod: college.paybackPeriod,
    collegeName: college.name
  });

  return {
    profileStrengthScore,
    admissionReadinessScore,
    collegeMatchScore,
    roiScore,
    placementStrengthScore,
    careerAlignmentScore,
    riskCompatibilityScore,
    finalRecommendationScore,
    admissionProbability,
    budgetFitScore,
    locationFitScore,
    explainability,
    roleOutcomes: college.placementStat?.topRoles ?? ["Management Trainee", "Associate Consultant", "Product Analyst"],
    paybackEstimate: college.paybackPeriod
  };
}

function buildExplainability(input: {
  profileStrengthScore: number;
  admissionProbability: number;
  roiScore: number;
  riskCompatibilityScore: number;
  budgetFitScore: number;
  locationFitScore: number;
  paybackPeriod: number;
  collegeName: string;
}) {
  const drivers = [
    input.profileStrengthScore >= 75 && "your profile aligns well with the program's typical intake",
    input.budgetFitScore >= 75 && "the total investment sits within your target budget band",
    input.roiScore >= 75 && `the estimated payback period is around ${input.paybackPeriod.toFixed(1)} years`,
    input.admissionProbability >= 75 && "your entrance profile gives you a strong admission window",
    input.locationFitScore >= 80 && "the campus location is closely aligned to your preference",
    input.riskCompatibilityScore >= 75 && "the risk level fits the confidence band you selected"
  ].filter(Boolean);

  if (drivers.length === 0) {
    return `${input.collegeName} remains a balanced option, but you may want to strengthen either your profile or budget flexibility before treating it as a top-priority target.`;
  }

  return `${input.collegeName} ranks highly because ${drivers.slice(0, 3).join(", and ")}.`;
}

export function scoreNarrative(score: number, label: string) {
  const band = scoreBand(score);

  if (band === "high") {
    return `${label} is strong. The current inputs suggest you are well-positioned on this dimension.`;
  }

  if (band === "medium") {
    return `${label} is moderate. You have a workable base, but sharper positioning could improve outcomes.`;
  }

  return `${label} is currently underpowered. Strengthening this dimension should materially improve your recommendations.`;
}

