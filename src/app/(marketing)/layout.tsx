import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { getSession } from "@/lib/session";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen">
      <PublicHeader authenticated={Boolean(session?.user)} />
      {children}
      <PublicFooter />
    </div>
  );
}
