import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const weights = Array.isArray(body.weights) ? body.weights : [];

  await Promise.all(
    weights.map((weight: { key: string; value: number }) =>
      prisma.scoringWeight.update({
        where: { key: weight.key },
        data: { value: weight.value }
      })
    )
  );

  return NextResponse.json({ ok: true });
}
