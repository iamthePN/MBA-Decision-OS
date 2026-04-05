import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/integrations/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const rate = checkRateLimit(`contact:${request.headers.get("x-forwarded-for") ?? "local"}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const payload = await request.json();
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: sanitizeText(parsed.data.name),
      email: sanitizeText(parsed.data.email).toLowerCase(),
      subject: sanitizeText(parsed.data.subject),
      message: sanitizeText(parsed.data.message)
    }
  });

  await sendEmail({
    to: process.env.EMAIL_FROM ?? "noreply@mbadecisionos.local",
    subject: `New contact submission: ${message.subject}`,
    html: `<p>${message.message}</p>`
  });

  return NextResponse.json({ ok: true, id: message.id });
}
