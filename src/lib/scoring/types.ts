import type {
  Achievement,
  College,
  CollegeExamAcceptance,
  CollegeRecruiter,
  CollegeRiskLevel,
  CollegeSector,
  CollegeSpecialization,
  ExamScore,
  ExamType,
  PlacementStat,
  Preference,
  RiskAppetite,
  StudentProfile,
  WorkExperience
} from "@prisma/client";

export type ProfileForScoring = StudentProfile & {
  examScores: (ExamScore & { examType: ExamType })[];
  workExperiences: WorkExperience[];
  achievements: Achievement[];
  preference: Preference | null;
};

export type CollegeForScoring = College & {
  examAcceptances: (CollegeExamAcceptance & { examType: ExamType })[];
  placementStat: PlacementStat | null;
  specializations: (CollegeSpecialization & { specialization: { name: string } })[];
  recruiters: (CollegeRecruiter & { recruiter: { name: string; category: string } })[];
  sectors: (CollegeSector & { sector: { name: string } })[];
};

export type RecommendationBreakdown = {
  profileStrengthScore: number;
  admissionReadinessScore: number;
  collegeMatchScore: number;
  roiScore: number;
  placementStrengthScore: number;
  careerAlignmentScore: number;
  riskCompatibilityScore: number;
  finalRecommendationScore: number;
  admissionProbability: number;
  budgetFitScore: number;
  locationFitScore: number;
  explainability: string;
  roleOutcomes: string[];
  paybackEstimate: number;
};

export const riskLevelOrder: Record<CollegeRiskLevel, number> = {
  SAFE: 1,
  BALANCED: 2,
  ASPIRATIONAL: 3
};

export const appetiteOrder: Record<RiskAppetite, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
};
