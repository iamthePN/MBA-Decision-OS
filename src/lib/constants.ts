export const APP_NAME = process.env.APP_NAME ?? "MBA Decision OS";
export const APP_TAGLINE = "From Applications to Outcomes";

export const riskAppetiteOptions = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" }
] as const;

export const fundingModeOptions = [
  { label: "Self Funded", value: "SELF_FUNDED" },
  { label: "Education Loan", value: "EDUCATION_LOAN" },
  { label: "Scholarship", value: "SCHOLARSHIP" },
  { label: "Hybrid", value: "HYBRID" }
] as const;

export const applicationStatusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Waitlist", value: "WAITLIST" },
  { label: "Admit", value: "ADMIT" },
  { label: "Reject", value: "REJECT" }
] as const;

export const examCodes = ["CAT", "XAT", "GMAT", "NMAT", "SNAP", "MAT", "GRE"] as const;

export const specializationOptions = [
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Business Analytics",
  "Product",
  "Consulting"
] as const;

export const industryOptions = [
  "Consulting",
  "Product",
  "Finance",
  "Marketing",
  "Analytics",
  "Operations",
  "Technology",
  "Healthcare",
  "Sustainability"
] as const;
