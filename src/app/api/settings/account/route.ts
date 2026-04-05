import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      email: String(body.email).toLowerCase()
    }
  });

  return NextResponse.json({ ok: true });
}
