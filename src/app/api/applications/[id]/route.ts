import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const application = await prisma.application.findFirst({ where: { id, userId: session.user.id } });
  if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const updated = await prisma.application.update({
    where: { id },
    data: {
      status: body.status ?? application.status,
      deadline: body.deadline ? new Date(body.deadline) : body.deadline === "" ? null : application.deadline,
      note: body.note ?? application.note,
      feesPaid: typeof body.feesPaid === "number" ? body.feesPaid : application.feesPaid,
      nextStep: body.nextStep ?? application.nextStep
    },
    include: { college: true }
  });

  return NextResponse.json({ application: serializeApplication(updated) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.application.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
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
