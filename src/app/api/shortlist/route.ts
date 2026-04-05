import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const collegeId = body.collegeId as string | undefined;
  if (!collegeId) return NextResponse.json({ error: "College is required" }, { status: 400 });

  await prisma.shortlist.upsert({
    where: {
      userId_collegeId: {
        userId: session.user.id,
        collegeId
      }
    },
    update: {},
    create: {
      userId: session.user.id,
      collegeId
    }
  });

  return NextResponse.json({ ok: true });
}
