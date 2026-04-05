import { requireUser } from "@/lib/session";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();

  return <PortalShell userName={session.user.name ?? "Student"}>{children}</PortalShell>;
}
