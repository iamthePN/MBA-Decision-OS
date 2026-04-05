import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const rate = checkRateLimit(`register:${request.headers.get("x-forwarded-for") ?? "local"}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many registration attempts. Please wait a minute." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const email = sanitizeText(parsed.data.email).toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: sanitizeText(parsed.data.name),
      email,
      passwordHash: hashPassword(parsed.data.password)
    }
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
