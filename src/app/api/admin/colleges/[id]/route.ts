import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { upsertCollege } from "@/lib/admin";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { collegeSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = collegeSchema.safeParse({ ...body, id });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const college = await upsertCollege(parsed.data);
  return NextResponse.json({ college });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.college.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
