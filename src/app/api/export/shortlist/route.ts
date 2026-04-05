import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";
import { toCsv } from "@/lib/export";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.shortlist.findMany({
    where: { userId: session.user.id },
    include: { college: true },
    orderBy: { createdAt: "desc" }
  });

  const csv = toCsv(rows.map((row) => ({ college: row.college.name, location: row.college.location, fees: row.college.totalFees, averageSalary: row.college.averageSalary, createdAt: row.createdAt.toISOString() })));

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="shortlist.csv"'
    }
  });
}
