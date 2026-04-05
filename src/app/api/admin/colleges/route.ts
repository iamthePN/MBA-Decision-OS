import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { upsertCollege } from "@/lib/admin";
import { authOptions } from "@/lib/auth/options";
import { collegeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = collegeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const college = await upsertCollege(parsed.data);
  return NextResponse.json({ college });
}
