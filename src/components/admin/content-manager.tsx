"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function splitText(value: string) {
  return value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
}

export function ContentManager({
  testimonials,
  pricingPlans,
  contacts,
  exams,
  recruiters,
  sectors
}: {
  testimonials: Array<{ id: string; name: string; role: string; program: string; quote: string; outcome: string; featured: boolean }>;
  pricingPlans: Array<{ id: string; name: string; priceMonthly: number; description: string; features: string[] }>;
  contacts: Array<{ id: string; name: string; email: string; subject: string; message: string; status: string }>;
  exams: Array<{ id: string; code: string; name: string }>;
  recruiters: Array<{ id: string; name: string; category: string }>;
  sectors: Array<{ id: string; name: string }>;
}) {
  const [type, setType] = useState("testimonial");
  const [form, setForm] = useState({ name: "", subtitle: "", quote: "", features: "", featured: false });

  async function createItem() {
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        name: form.name,
        subtitle: form.subtitle,
        quote: form.quote,
        features: splitText(form.features),
        featured: form.featured
      })
    });

    if (!response.ok) {
      toast.error("Unable to create content item");
      return;
    }

    setForm({ name: "", subtitle: "", quote: "", features: "", featured: false });
    toast.success("Content item created.");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <Label>Content type</Label>
            <Select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="testimonial">Testimonial</option>
              <option value="pricing">Pricing plan</option>
              <option value="exam">Exam</option>
              <option value="recruiter">Recruiter</option>
              <option value="sector">Sector</option>
            </Select>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <Label>Subtitle / role</Label>
            <Input value={form.subtitle} onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))} />
          </div>
          <div className="md:col-span-2 xl:col-span-2">
            <Label>Quote / description</Label>
            <Textarea value={form.quote} onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))} />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <Label>Features / extra data</Label>
            <Textarea value={form.features} onChange={(event) => setForm((current) => ({ ...current, features: event.target.value }))} placeholder="Comma separated when creating pricing plans" />
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input checked={form.featured} type="checkbox" onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} />
            <span className="text-sm">Featured</span>
          </div>
          <div>
            <Button type="button" onClick={createItem}>Create item</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Testimonials</h2>
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-3xl bg-muted/20 p-4 text-sm">
                <p className="font-medium">{item.name} · {item.role}</p>
                <p className="mt-2 text-muted-foreground">{item.quote}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Pricing plans</h2>
            {pricingPlans.map((item) => (
              <div key={item.id} className="rounded-3xl bg-muted/20 p-4 text-sm">
                <p className="font-medium">{item.name} · {item.priceMonthly}</p>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Contact messages</h2>
            {contacts.map((item) => (
              <div key={item.id} className="rounded-3xl bg-muted/20 p-4 text-sm">
                <p className="font-medium">{item.subject} · {item.name}</p>
                <p className="mt-2 text-muted-foreground">{item.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6 text-sm">
            <h2 className="text-xl font-semibold">Reference catalogs</h2>
            <p>Exams: {exams.map((item) => item.code).join(", ")}</p>
            <p>Recruiters: {recruiters.map((item) => item.name).slice(0, 8).join(", ")}</p>
            <p>Sectors: {sectors.map((item) => item.name).join(", ")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
