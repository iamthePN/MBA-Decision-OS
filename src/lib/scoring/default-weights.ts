export const defaultScoringWeights = [
  {
    key: "profile.academic",
    label: "Academic consistency",
    group: "profile",
    value: 0.24,
    description: "Weight for academic history in the profile strength score."
  },
  {
    key: "profile.exam",
    label: "Entrance exam quality",
    group: "profile",
    value: 0.28,
    description: "Weight for normalized entrance exam performance."
  },
  {
    key: "profile.work",
    label: "Work experience",
    group: "profile",
    value: 0.18,
    description: "Weight for quality and quantity of work experience."
  },
  {
    key: "profile.achievements",
    label: "Leadership and achievements",
    group: "profile",
    value: 0.12,
    description: "Weight for extracurriculars, certifications, awards, and internships."
  },
  {
    key: "profile.goals",
    label: "Goal clarity",
    group: "profile",
    value: 0.1,
    description: "Weight for clarity of short-term and long-term goals."
  },
  {
    key: "profile.budget",
    label: "Budget realism",
    group: "profile",
    value: 0.08,
    description: "Weight for whether target budget aligns with strong programs."
  },
  {
    key: "match.specialization",
    label: "Specialization fit",
    group: "match",
    value: 0.22,
    description: "Fit between the user specialization and college strengths."
  },
  {
    key: "match.location",
    label: "Location fit",
    group: "match",
    value: 0.1,
    description: "Fit between location preferences and college geography."
  },
  {
    key: "match.budget",
    label: "Budget fit",
    group: "match",
    value: 0.16,
    description: "Fit between budget range and total investment."
  },
  {
    key: "match.placement",
    label: "Placement quality",
    group: "match",
    value: 0.2,
    description: "Strength of placement outcomes and employer quality."
  },
  {
    key: "match.sector",
    label: "Sector fit",
    group: "match",
    value: 0.14,
    description: "Fit with preferred industries and employer ecosystem."
  },
  {
    key: "match.risk",
    label: "Risk alignment",
    group: "match",
    value: 0.18,
    description: "Alignment of college risk with the student's appetite."
  },
  {
    key: "roi.salary",
    label: "Average salary",
    group: "roi",
    value: 0.3,
    description: "Contribution of average placement salary to ROI."
  },
  {
    key: "roi.median",
    label: "Median salary",
    group: "roi",
    value: 0.2,
    description: "Contribution of median salary to ROI."
  },
  {
    key: "roi.cost",
    label: "Total investment",
    group: "roi",
    value: 0.18,
    description: "Penalty/benefit based on total cost of attendance."
  },
  {
    key: "roi.payback",
    label: "Payback period",
    group: "roi",
    value: 0.2,
    description: "Contribution of expected payback speed to ROI."
  },
  {
    key: "roi.placement_rate",
    label: "Placement rate",
    group: "roi",
    value: 0.12,
    description: "Contribution of placement success rate to ROI."
  },
  {
    key: "final.profile_fit",
    label: "Profile fit",
    group: "final",
    value: 0.18,
    description: "Weight for profile and college match quality."
  },
  {
    key: "final.admission",
    label: "Admission probability",
    group: "final",
    value: 0.18,
    description: "Weight for predicted admission probability."
  },
  {
    key: "final.roi",
    label: "ROI",
    group: "final",
    value: 0.2,
    description: "Weight for the calculated ROI score."
  },
  {
    key: "final.placement",
    label: "Placement strength",
    group: "final",
    value: 0.14,
    description: "Weight for placement strength score."
  },
  {
    key: "final.career",
    label: "Career alignment",
    group: "final",
    value: 0.12,
    description: "Weight for role quality and career trajectory alignment."
  },
  {
    key: "final.risk",
    label: "Risk compatibility",
    group: "final",
    value: 0.08,
    description: "Weight for risk compatibility."
  },
  {
    key: "final.budget",
    label: "Budget fit",
    group: "final",
    value: 0.06,
    description: "Weight for budget compatibility."
  },
  {
    key: "final.location",
    label: "Location fit",
    group: "final",
    value: 0.04,
    description: "Weight for location fit."
  }
] as const;

export function weightsToMap(
  weights: Array<{ key: string; value: number }> = defaultScoringWeights.map((weight) => ({
    key: weight.key,
    value: weight.value
  }))
) {
  return Object.fromEntries(weights.map((weight) => [weight.key, weight.value]));
}
