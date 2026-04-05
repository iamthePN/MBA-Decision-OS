import { ContentManager } from "@/components/admin/content-manager";
import { getAdminOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const data = await getAdminOverview();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="section-kicker">Content and Catalogs</p>
        <h1 className="text-3xl font-semibold tracking-tight">Manage testimonials, pricing, messages, exams, recruiters, and sectors.</h1>
      </div>
      <ContentManager contacts={data.contacts} exams={data.exams} pricingPlans={data.pricingPlans} recruiters={data.recruiters} sectors={data.sectors} testimonials={data.testimonials} />
    </div>
  );
}
