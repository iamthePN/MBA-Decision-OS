import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { buildProfileCompletion } from "@/lib/data";
import { prisma } from "@/lib/db";
import { sanitizeStringArray, sanitizeText } from "@/lib/sanitize";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      educationRecords: true,
      examScores: { include: { examType: true } },
      achievements: true,
      preference: true
    }
  });

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const specialization = await prisma.specialization.upsert({
    where: { name: sanitizeText(parsed.data.preferredSpecialization) },
    update: {},
    create: {
      name: sanitizeText(parsed.data.preferredSpecialization),
      description: `${parsed.data.preferredSpecialization} specialization`
    }
  });

  const examType = await prisma.examType.findUnique({ where: { code: parsed.data.examTypeCode } });
  if (!examType) {
    return NextResponse.json({ error: "Unsupported exam type" }, { status: 400 });
  }

  const profileCompletion = buildProfileCompletion({
    country: parsed.data.country,
    undergradInstitution: parsed.data.undergradInstitution,
    undergradDegree: parsed.data.undergradDegree,
    currentJobRole: parsed.data.currentJobRole,
    academicHistory: parsed.data.academicHistory,
    examTypeCode: parsed.data.examTypeCode,
    preferredSpecialization: parsed.data.preferredSpecialization,
    preferredLocation: parsed.data.preferredLocation,
    shortTermGoals: parsed.data.shortTermGoals,
    longTermGoals: parsed.data.longTermGoals,
    preferredIndustries: parsed.data.preferredIndustries,
    workExperienceMonths: parsed.data.workExperienceMonths,
    targetIntakeYear: parsed.data.targetIntakeYear
  });

  const profile = await prisma.studentProfile.upsert({
    where: { userId: session.user.id },
    update: {
      country: sanitizeText(parsed.data.country),
      academicHistory: parsed.data.academicHistory ? sanitizeText(parsed.data.academicHistory) : null,
      undergradInstitution: sanitizeText(parsed.data.undergradInstitution),
      undergradDegree: sanitizeText(parsed.data.undergradDegree),
      tenthScore: parsed.data.tenthScore,
      twelfthScore: parsed.data.twelfthScore,
      undergraduateScore: parsed.data.undergraduateScore,
      workExperienceMonths: parsed.data.workExperienceMonths,
      currentJobRole: parsed.data.currentJobRole ? sanitizeText(parsed.data.currentJobRole) : null,
      profileCompletion,
      scholarshipNeed: parsed.data.scholarshipNeed,
      targetIntakeYear: parsed.data.targetIntakeYear,
      shortTermGoals: sanitizeText(parsed.data.shortTermGoals),
      longTermGoals: sanitizeText(parsed.data.longTermGoals),
      preferredIndustries: sanitizeStringArray(parsed.data.preferredIndustries)
    },
    create: {
      userId: session.user.id,
      country: sanitizeText(parsed.data.country),
      academicHistory: parsed.data.academicHistory ? sanitizeText(parsed.data.academicHistory) : null,
      undergradInstitution: sanitizeText(parsed.data.undergradInstitution),
      undergradDegree: sanitizeText(parsed.data.undergradDegree),
      tenthScore: parsed.data.tenthScore,
      twelfthScore: parsed.data.twelfthScore,
      undergraduateScore: parsed.data.undergraduateScore,
      workExperienceMonths: parsed.data.workExperienceMonths,
      currentJobRole: parsed.data.currentJobRole ? sanitizeText(parsed.data.currentJobRole) : null,
      profileCompletion,
      scholarshipNeed: parsed.data.scholarshipNeed,
      targetIntakeYear: parsed.data.targetIntakeYear,
      shortTermGoals: sanitizeText(parsed.data.shortTermGoals),
      longTermGoals: sanitizeText(parsed.data.longTermGoals),
      preferredIndustries: sanitizeStringArray(parsed.data.preferredIndustries)
    }
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: sanitizeText(parsed.data.fullName) }
  });

  await Promise.all([
    prisma.educationRecord.deleteMany({ where: { studentProfileId: profile.id } }),
    prisma.examScore.deleteMany({ where: { studentProfileId: profile.id } }),
    prisma.workExperience.deleteMany({ where: { studentProfileId: profile.id } }),
    prisma.achievement.deleteMany({ where: { studentProfileId: profile.id } })
  ]);

  await prisma.educationRecord.createMany({
    data: [
      { studentProfileId: profile.id, level: "10th", institution: "School Record", score: parsed.data.tenthScore },
      { studentProfileId: profile.id, level: "12th", institution: "School Record", score: parsed.data.twelfthScore },
      {
        studentProfileId: profile.id,
        level: "Undergraduate",
        institution: sanitizeText(parsed.data.undergradInstitution),
        specialization: sanitizeText(parsed.data.undergradDegree),
        score: parsed.data.undergraduateScore
      }
    ]
  });

  await prisma.examScore.create({
    data: {
      studentProfileId: profile.id,
      examTypeId: examType.id,
      score: parsed.data.examScore,
      percentile: parsed.data.examPercentile ?? null
    }
  });

  if (parsed.data.workExperienceMonths > 0) {
    await prisma.workExperience.create({
      data: {
        studentProfileId: profile.id,
        company: "Current employer",
        role: parsed.data.currentJobRole ? sanitizeText(parsed.data.currentJobRole) : "Professional",
        industry: parsed.data.preferredIndustries[0] ?? "General Management",
        durationMonths: parsed.data.workExperienceMonths,
        isCurrent: true,
        summary: parsed.data.currentJobRole ? sanitizeText(parsed.data.currentJobRole) : null
      }
    });
  }

  const achievements = [
    ...parsed.data.internships.map((title) => ({ type: "INTERNSHIP" as const, title })),
    ...parsed.data.extracurricularAchievements.map((title) => ({ type: "EXTRACURRICULAR" as const, title })),
    ...parsed.data.certifications.map((title) => ({ type: "CERTIFICATION" as const, title }))
  ];

  if (achievements.length) {
    await prisma.achievement.createMany({
      data: achievements.map((achievement) => ({
        studentProfileId: profile.id,
        type: achievement.type,
        title: sanitizeText(achievement.title)
      }))
    });
  }

  await prisma.preference.upsert({
    where: { studentProfileId: profile.id },
    update: {
      specializationId: specialization.id,
      preferredLocation: sanitizeText(parsed.data.preferredLocation),
      budgetMin: parsed.data.budgetMin,
      budgetMax: parsed.data.budgetMax,
      riskAppetite: parsed.data.riskAppetite,
      fundingMode: parsed.data.fundingMode,
      targetRole: parsed.data.targetRole ? sanitizeText(parsed.data.targetRole) : null,
      preferredSectors: sanitizeStringArray(parsed.data.preferredIndustries)
    },
    create: {
      studentProfileId: profile.id,
      specializationId: specialization.id,
      preferredLocation: sanitizeText(parsed.data.preferredLocation),
      budgetMin: parsed.data.budgetMin,
      budgetMax: parsed.data.budgetMax,
      riskAppetite: parsed.data.riskAppetite,
      fundingMode: parsed.data.fundingMode,
      targetRole: parsed.data.targetRole ? sanitizeText(parsed.data.targetRole) : null,
      preferredSectors: sanitizeStringArray(parsed.data.preferredIndustries)
    }
  });

  return NextResponse.json({ ok: true, profileId: profile.id });
}
