"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { examCodes, fundingModeOptions, riskAppetiteOptions, specializationOptions } from "@/lib/constants";
import { profileSchema } from "@/lib/validations";

const formSchema = z.object({
  fullName: z.string().min(2),
  country: z.string().min(2),
  academicHistory: z.string().optional(),
  undergradInstitution: z.string().min(2),
  undergradDegree: z.string().min(2),
  tenthScore: z.coerce.number().min(0).max(100),
  twelfthScore: z.coerce.number().min(0).max(100),
  undergraduateScore: z.coerce.number().min(0).max(100),
  examTypeCode: z.string().min(2),
  examScore: z.coerce.number().min(0),
  examPercentile: z.coerce.number().min(0).max(100).optional(),
  workExperienceMonths: z.coerce.number().min(0).max(240),
  currentJobRole: z.string().optional(),
  internshipsText: z.string().optional(),
  extracurricularText: z.string().optional(),
  certificationsText: z.string().optional(),
  preferredSpecialization: z.string().min(2),
  preferredLocation: z.string().min(2),
  budgetMin: z.coerce.number().min(0),
  budgetMax: z.coerce.number().min(100000),
  riskAppetite: z.enum(["LOW", "MEDIUM", "HIGH"]),
  shortTermGoals: z.string().min(10),
  longTermGoals: z.string().min(10),
  preferredIndustriesText: z.string().min(2),
  scholarshipNeed: z.boolean().default(false),
  targetIntakeYear: z.coerce.number().min(2026).max(2032),
  fundingMode: z.enum(["SELF_FUNDED", "EDUCATION_LOAN", "SCHOLARSHIP", "HYBRID"]),
  targetRole: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

function splitValues(value?: string) {
  return (value ?? "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfileBuilderForm({
  initialValues
}: {
  initialValues?: Partial<FormValues>;
}) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialValues?.fullName ?? "",
      country: initialValues?.country ?? "India",
      academicHistory: initialValues?.academicHistory ?? "",
      undergradInstitution: initialValues?.undergradInstitution ?? "",
      undergradDegree: initialValues?.undergradDegree ?? "",
      tenthScore: initialValues?.tenthScore ?? 85,
      twelfthScore: initialValues?.twelfthScore ?? 84,
      undergraduateScore: initialValues?.undergraduateScore ?? 76,
      examTypeCode: initialValues?.examTypeCode ?? "CAT",
      examScore: initialValues?.examScore ?? 92,
      examPercentile: initialValues?.examPercentile ?? 88,
      workExperienceMonths: initialValues?.workExperienceMonths ?? 24,
      currentJobRole: initialValues?.currentJobRole ?? "",
      internshipsText: initialValues?.internshipsText ?? "",
      extracurricularText: initialValues?.extracurricularText ?? "",
      certificationsText: initialValues?.certificationsText ?? "",
      preferredSpecialization: initialValues?.preferredSpecialization ?? specializationOptions[0],
      preferredLocation: initialValues?.preferredLocation ?? "Bengaluru",
      budgetMin: initialValues?.budgetMin ?? 1200000,
      budgetMax: initialValues?.budgetMax ?? 2500000,
      riskAppetite: initialValues?.riskAppetite ?? "MEDIUM",
      shortTermGoals: initialValues?.shortTermGoals ?? "Move into a post-MBA strategy or product role with stronger leadership exposure.",
      longTermGoals: initialValues?.longTermGoals ?? "Build toward a senior operating role with international mobility and long-term wealth creation.",
      preferredIndustriesText: initialValues?.preferredIndustriesText ?? "Consulting, Product, Analytics",
      scholarshipNeed: initialValues?.scholarshipNeed ?? false,
      targetIntakeYear: initialValues?.targetIntakeYear ?? 2027,
      fundingMode: initialValues?.fundingMode ?? "SELF_FUNDED",
      targetRole: initialValues?.targetRole ?? "Associate Consultant"
    }
  });

  const watchedValues = watch();

  const completion = useMemo(() => {
    const checks = [
      watchedValues.fullName,
      watchedValues.country,
      watchedValues.undergradInstitution,
      watchedValues.undergradDegree,
      watchedValues.examTypeCode,
      watchedValues.currentJobRole,
      watchedValues.preferredSpecialization,
      watchedValues.preferredLocation,
      watchedValues.shortTermGoals,
      watchedValues.longTermGoals,
      watchedValues.preferredIndustriesText
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [watchedValues]);

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        academicHistory: values.academicHistory ?? "",
        currentJobRole: values.currentJobRole ?? "",
        targetRole: values.targetRole ?? "",
        internships: splitValues(values.internshipsText),
        extracurricularAchievements: splitValues(values.extracurricularText),
        certifications: splitValues(values.certificationsText),
        preferredIndustries: splitValues(values.preferredIndustriesText)
      };

      const parsed = profileSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error("Please fix the validation issues before saving.");
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });

      if (!response.ok) {
        throw new Error("Unable to save profile");
      }

      toast.success("Profile updated. Recommendations will refresh automatically.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm text-muted-foreground">Profile completeness</p>
            <p className="mt-1 text-3xl font-semibold">{completion}%</p>
          </div>
          <div className="h-3 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
          </div>
        </CardContent>
      </Card>
      <form className="space-y-6" onSubmit={onSubmit}>
        <Card>
          <CardContent className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName ? <p className="mt-2 text-sm text-danger">{errors.fullName.message}</p> : null}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
            </div>
            <div>
              <Label htmlFor="currentJobRole">Current job role</Label>
              <Input id="currentJobRole" {...register("currentJobRole")} />
            </div>
            <div>
              <Label htmlFor="undergradInstitution">Undergraduate institution</Label>
              <Input id="undergradInstitution" {...register("undergradInstitution")} />
            </div>
            <div>
              <Label htmlFor="undergradDegree">Undergraduate degree</Label>
              <Input id="undergradDegree" {...register("undergradDegree")} />
            </div>
            <div>
              <Label htmlFor="targetIntakeYear">Target intake year</Label>
              <Input id="targetIntakeYear" type="number" {...register("targetIntakeYear", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="tenthScore">10th score</Label>
              <Input id="tenthScore" type="number" step="0.1" {...register("tenthScore", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="twelfthScore">12th score</Label>
              <Input id="twelfthScore" type="number" step="0.1" {...register("twelfthScore", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="undergraduateScore">Undergraduate score</Label>
              <Input id="undergraduateScore" type="number" step="0.1" {...register("undergraduateScore", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="examTypeCode">Entrance exam</Label>
              <Select id="examTypeCode" {...register("examTypeCode")}>
                {examCodes.map((exam) => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="examScore">Exam score</Label>
              <Input id="examScore" type="number" step="0.1" {...register("examScore", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="examPercentile">Exam percentile</Label>
              <Input id="examPercentile" type="number" step="0.1" {...register("examPercentile", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="workExperienceMonths">Work experience (months)</Label>
              <Input id="workExperienceMonths" type="number" {...register("workExperienceMonths", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="preferredSpecialization">Preferred MBA specialization</Label>
              <Select id="preferredSpecialization" {...register("preferredSpecialization")}>
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredLocation">Preferred location</Label>
              <Input id="preferredLocation" {...register("preferredLocation")} />
            </div>
            <div>
              <Label htmlFor="budgetMin">Budget min</Label>
              <Input id="budgetMin" type="number" {...register("budgetMin", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="budgetMax">Budget max</Label>
              <Input id="budgetMax" type="number" {...register("budgetMax", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="riskAppetite">Risk appetite</Label>
              <Select id="riskAppetite" {...register("riskAppetite")}>
                {riskAppetiteOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="fundingMode">Funding mode</Label>
              <Select id="fundingMode" {...register("fundingMode")}>
                {fundingModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="targetRole">Expected post-MBA role</Label>
              <Input id="targetRole" {...register("targetRole")} />
            </div>
            <div className="flex items-center gap-3 pt-8">
              <Checkbox id="scholarshipNeed" {...register("scholarshipNeed")} />
              <Label className="mb-0" htmlFor="scholarshipNeed">I need scholarship support</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-5 p-6 lg:grid-cols-2">
            <div>
              <Label htmlFor="academicHistory">Academic history summary</Label>
              <Textarea id="academicHistory" {...register("academicHistory")} />
            </div>
            <div>
              <Label htmlFor="shortTermGoals">Short-term career goals</Label>
              <Textarea id="shortTermGoals" {...register("shortTermGoals")} />
            </div>
            <div>
              <Label htmlFor="longTermGoals">Long-term career goals</Label>
              <Textarea id="longTermGoals" {...register("longTermGoals")} />
            </div>
            <div>
              <Label htmlFor="preferredIndustriesText">Preferred post-MBA industries</Label>
              <Textarea id="preferredIndustriesText" placeholder="Consulting, Product, Analytics" {...register("preferredIndustriesText")} />
            </div>
            <div>
              <Label htmlFor="internshipsText">Internships</Label>
              <Textarea id="internshipsText" placeholder="Comma or newline separated" {...register("internshipsText")} />
            </div>
            <div>
              <Label htmlFor="extracurricularText">Extracurricular achievements</Label>
              <Textarea id="extracurricularText" placeholder="Comma or newline separated" {...register("extracurricularText")} />
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="certificationsText">Certifications</Label>
              <Textarea id="certificationsText" placeholder="Comma or newline separated" {...register("certificationsText")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button disabled={saving} size="lg" type="submit">{saving ? "Saving profile..." : "Save profile"}</Button>
        </div>
      </form>
    </div>
  );
}


