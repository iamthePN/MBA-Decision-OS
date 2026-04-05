import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const type = body.type as string;

  if (type === "testimonial") {
    await prisma.testimonial.create({
      data: {
        name: body.name,
        role: body.subtitle || "Student",
        program: body.features?.[0] || "MBA Program",
        quote: body.quote || "",
        outcome: body.features?.[1] || "Improved confidence",
        featured: Boolean(body.featured)
      }
    });
  } else if (type === "pricing") {
    await prisma.pricingPlan.create({
      data: {
        name: body.name,
        slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        priceMonthly: Number(body.subtitle || 0),
        description: body.quote || "",
        features: Array.isArray(body.features) ? body.features : [],
        ctaLabel: "Select plan",
        highlighted: Boolean(body.featured)
      }
    });
  } else if (type === "exam") {
    await prisma.examType.create({
      data: {
        code: body.name,
        name: body.subtitle || body.name,
        maxScore: 100,
        benchmarkScore: 80,
        description: body.quote || "Exam entry"
      }
    });
  } else if (type === "recruiter") {
    await prisma.recruiter.create({
      data: {
        name: body.name,
        category: body.subtitle || "Employer",
        description: body.quote || "Recruiter entry"
      }
    });
  } else if (type === "sector") {
    await prisma.sector.create({
      data: {
        name: body.name,
        description: body.quote || "Sector entry"
      }
    });
  }

  return NextResponse.json({ ok: true });
}
