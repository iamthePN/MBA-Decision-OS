import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { toCsv } from "@/lib/export";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { college: true },
    orderBy: { updatedAt: "desc" }
  });

  const csv = toCsv(rows.map((row) => ({ college: row.college.name, status: row.status, deadline: row.deadline?.toISOString() ?? "", feesPaid: row.feesPaid, nextStep: row.nextStep ?? "", updatedAt: row.updatedAt.toISOString() })));

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="applications.csv"'
    }
  });
}
