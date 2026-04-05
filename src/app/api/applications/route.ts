import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { applicationSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const application = await prisma.application.upsert({
    where: {
      userId_collegeId: {
        userId: session.user.id,
        collegeId: parsed.data.collegeId
      }
    },
    update: {
      status: parsed.data.status,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      note: parsed.data.note ?? null,
      feesPaid: parsed.data.feesPaid,
      nextStep: parsed.data.nextStep ?? null
    },
    create: {
      userId: session.user.id,
      collegeId: parsed.data.collegeId,
      status: parsed.data.status,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      note: parsed.data.note ?? null,
      feesPaid: parsed.data.feesPaid,
      nextStep: parsed.data.nextStep ?? null
    },
    include: {
      college: true
    }
  });

  return NextResponse.json({ application: serializeApplication(application) });
}

function serializeApplication(application: any) {
  return {
    id: application.id,
    collegeId: application.collegeId,
    status: application.status,
    deadline: application.deadline ? application.deadline.toISOString() : null,
    note: application.note,
    feesPaid: application.feesPaid,
    nextStep: application.nextStep,
    college: {
      id: application.college.id,
      name: application.college.name,
      location: application.college.location
    }
  };
}
