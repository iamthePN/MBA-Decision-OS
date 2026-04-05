"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, PencilLine, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { collegeSchema } from "@/lib/validations";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  location: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  overview: z.string().min(20),
  totalFees: z.coerce.number().min(100000),
  livingCostAnnual: z.coerce.number().min(0),
  averageSalary: z.coerce.number().min(100000),
  medianSalary: z.coerce.number().min(100000),
  highestSalary: z.coerce.number().min(100000),
  placementRate: z.coerce.number().min(0).max(100),
  paybackPeriod: z.coerce.number().min(0.5).max(10),
  intakeSize: z.coerce.number().min(30),
  durationMonths: z.coerce.number().min(6),
  type: z.enum(["PRIVATE", "PUBLIC", "AUTONOMOUS", "GLOBAL"]),
  riskLevel: z.enum(["SAFE", "BALANCED", "ASPIRATIONAL"]),
  rankingNote: z.string().optional(),
  website: z.string().optional(),
  logoText: z.string().min(1).max(6),
  featured: z.boolean().default(false),
  acceptedExamCodesText: z.string().optional(),
  specializationNamesText: z.string().optional(),
  recruiterNamesText: z.string().optional(),
  sectorNamesText: z.string().optional(),
  topRolesText: z.string().optional(),
  consultingShare: z.coerce.number().min(0).max(100),
  financeShare: z.coerce.number().min(0).max(100),
  analyticsShare: z.coerce.number().min(0).max(100),
  productShare: z.coerce.number().min(0).max(100),
  operationsShare: z.coerce.number().min(0).max(100),
  internationalPlacementRate: z.coerce.number().min(0).max(100)
});

type CollegeRow = {
  id: string;
  slug: string;
  name: string;
  location: string;
  city: string;
  country: string;
  overview: string;
  totalFees: number;
  livingCostAnnual: number;
  averageSalary: number;
  medianSalary: number;
  highestSalary: number;
  placementRate: number;
  paybackPeriod: number;
  intakeSize: number;
  durationMonths: number;
  type: "PRIVATE" | "PUBLIC" | "AUTONOMOUS" | "GLOBAL";
  riskLevel: "SAFE" | "BALANCED" | "ASPIRATIONAL";
  rankingNote: string | null;
  website: string | null;
  logoText: string;
  featured: boolean;
  examCodes: string[];
  specializations: string[];
  recruiters: string[];
  sectors: string[];
  topRoles: string[];
  consultingShare: number;
  financeShare: number;
  analyticsShare: number;
  productShare: number;
  operationsShare: number;
  internationalPlacementRate: number;
};

type FormValues = z.infer<typeof formSchema>;

function splitText(value?: string) {
  return (value ?? "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
}

export function AdminCollegeManager({ colleges: initialColleges }: { colleges: CollegeRow[] }) {
  const [colleges, setColleges] = useState(initialColleges);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      location: "",
      city: "",
      country: "India",
      overview: "",
      totalFees: 1800000,
      livingCostAnnual: 350000,
      averageSalary: 1800000,
      medianSalary: 1650000,
      highestSalary: 3100000,
      placementRate: 92,
      paybackPeriod: 2.1,
      intakeSize: 240,
      durationMonths: 24,
      type: "PRIVATE",
      riskLevel: "BALANCED",
      rankingNote: "",
      website: "",
      logoText: "MBA",
      featured: false,
      acceptedExamCodesText: "CAT, GMAT",
      specializationNamesText: "Marketing, Finance, Consulting",
      recruiterNamesText: "McKinsey, Deloitte",
      sectorNamesText: "Consulting, Finance",
      topRolesText: "Associate Consultant, Product Manager",
      consultingShare: 28,
      financeShare: 22,
      analyticsShare: 16,
      productShare: 14,
      operationsShare: 12,
      internationalPlacementRate: 8
    }
  });

  const featuredCount = useMemo(() => colleges.filter((college) => college.featured).length, [colleges]);

  const submit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        id: values.id,
        name: values.name,
        slug: values.slug,
        location: values.location,
        city: values.city,
        country: values.country,
        overview: values.overview,
        totalFees: values.totalFees,
        livingCostAnnual: values.livingCostAnnual,
        averageSalary: values.averageSalary,
        medianSalary: values.medianSalary,
        highestSalary: values.highestSalary,
        placementRate: values.placementRate,
        paybackPeriod: values.paybackPeriod,
        intakeSize: values.intakeSize,
        durationMonths: values.durationMonths,
        type: values.type,
        riskLevel: values.riskLevel,
        rankingNote: values.rankingNote,
        website: values.website,
        logoText: values.logoText,
        featured: Boolean(values.featured),
        acceptedExamCodes: splitText(values.acceptedExamCodesText),
        specializationNames: splitText(values.specializationNamesText),
        recruiterNames: splitText(values.recruiterNamesText),
        sectorNames: splitText(values.sectorNamesText),
        topRoles: splitText(values.topRolesText),
        consultingShare: values.consultingShare,
        financeShare: values.financeShare,
        analyticsShare: values.analyticsShare,
        productShare: values.productShare,
        operationsShare: values.operationsShare,
        internationalPlacementRate: values.internationalPlacementRate
      };

      const parsed = collegeSchema.safeParse(payload);
      if (!parsed.success) throw new Error("Please review the college form fields.");

      const response = await fetch(`/api/admin/colleges${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to save college");

      setColleges((current) => {
        if (editingId) {
          return current.map((college) => (college.id === editingId ? body.college : college));
        }
        return [body.college, ...current];
      });
      setEditingId(null);
      reset();
      toast.success(editingId ? "College updated." : "College created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save college");
    } finally {
      setSaving(false);
    }
  });

  async function importCsv() {
    if (!file) {
      toast.error("Select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/colleges/import", {
      method: "POST",
      body: formData
    });
    const body = await response.json();
    if (!response.ok) {
      toast.error(body.error ?? "Unable to import CSV");
      return;
    }

    setColleges(body.colleges);
    toast.success(`Imported ${body.imported} colleges.`);
  }

  async function removeCollege(id: string) {
    const response = await fetch(`/api/admin/colleges/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete college");
      return;
    }
    setColleges((current) => current.filter((college) => college.id !== id));
    toast.success("College deleted.");
  }

  function editCollege(college: CollegeRow) {
    setEditingId(college.id);
    reset({
      id: college.id,
      name: college.name,
      slug: college.slug,
      location: college.location,
      city: college.city,
      country: college.country,
      overview: college.overview,
      totalFees: college.totalFees,
      livingCostAnnual: college.livingCostAnnual,
      averageSalary: college.averageSalary,
      medianSalary: college.medianSalary,
      highestSalary: college.highestSalary,
      placementRate: college.placementRate,
      paybackPeriod: college.paybackPeriod,
      intakeSize: college.intakeSize,
      durationMonths: college.durationMonths,
      type: college.type,
      riskLevel: college.riskLevel,
      rankingNote: college.rankingNote ?? "",
      website: college.website ?? "",
      logoText: college.logoText,
      featured: college.featured,
      acceptedExamCodesText: college.examCodes.join(", "),
      specializationNamesText: college.specializations.join(", "),
      recruiterNamesText: college.recruiters.join(", "),
      sectorNamesText: college.sectors.join(", "),
      topRolesText: college.topRoles.join(", "),
      consultingShare: college.consultingShare,
      financeShare: college.financeShare,
      analyticsShare: college.analyticsShare,
      productShare: college.productShare,
      operationsShare: college.operationsShare,
      internationalPlacementRate: college.internationalPlacementRate
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">College catalog</h2>
              <p className="text-sm text-muted-foreground">{colleges.length} colleges in catalog · {featuredCount} featured on landing page</p>
            </div>
            <div className="flex items-center gap-3">
              <Input type="file" accept=".csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
              <Button type="button" variant="outline" onClick={importCsv}>
                <FileUp className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{editingId ? "Edit college" : "Create college"}</h2>
            <Button type="button" variant="ghost" onClick={() => { setEditingId(null); reset(); }}>Reset</Button>
          </div>
          <form className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" onSubmit={submit}>
            {[
              ["name", "Name"],
              ["slug", "Slug"],
              ["location", "Location"],
              ["city", "City"],
              ["country", "Country"],
              ["totalFees", "Total fees"],
              ["livingCostAnnual", "Living cost annual"],
              ["averageSalary", "Average salary"],
              ["medianSalary", "Median salary"],
              ["highestSalary", "Highest salary"],
              ["placementRate", "Placement rate"],
              ["paybackPeriod", "Payback period"],
              ["intakeSize", "Intake size"],
              ["durationMonths", "Duration months"],
              ["logoText", "Logo text"],
              ["rankingNote", "Ranking note"]
            ].map(([name, label]) => (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                <Input id={name} {...register(name as keyof FormValues)} />
              </div>
            ))}
            <div>
              <Label htmlFor="type">College type</Label>
              <Select id="type" {...register("type")}>
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
                <option value="AUTONOMOUS">Autonomous</option>
                <option value="GLOBAL">Global</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="riskLevel">Risk level</Label>
              <Select id="riskLevel" {...register("riskLevel")}>
                <option value="SAFE">Safe</option>
                <option value="BALANCED">Balanced</option>
                <option value="ASPIRATIONAL">Aspirational</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("website")} />
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input id="featured" type="checkbox" {...register("featured")} />
              <Label className="mb-0" htmlFor="featured">Featured on landing page</Label>
            </div>
            <div className="md:col-span-2 xl:col-span-4">
              <Label htmlFor="overview">Overview</Label>
              <Textarea id="overview" {...register("overview")} />
            </div>
            {[
              ["acceptedExamCodesText", "Accepted exam codes"],
              ["specializationNamesText", "Specializations"],
              ["recruiterNamesText", "Recruiters"],
              ["sectorNamesText", "Sectors"],
              ["topRolesText", "Top roles"]
            ].map(([name, label]) => (
              <div key={name} className="md:col-span-2 xl:col-span-2">
                <Label htmlFor={name}>{label}</Label>
                <Textarea id={name} {...register(name as keyof FormValues)} />
              </div>
            ))}
            <div className="grid gap-5 md:col-span-2 xl:col-span-4 xl:grid-cols-6">
              {[
                ["consultingShare", "Consulting share"],
                ["financeShare", "Finance share"],
                ["analyticsShare", "Analytics share"],
                ["productShare", "Product share"],
                ["operationsShare", "Operations share"],
                ["internationalPlacementRate", "International rate"]
              ].map(([name, label]) => (
                <div key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} {...register(name as keyof FormValues)} />
                </div>
              ))}
            </div>
            <div className="md:col-span-2 xl:col-span-4">
              <Button disabled={saving} type="submit">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : editingId ? "Update college" : "Create college"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {colleges.map((college) => (
          <Card key={college.id}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{college.name}</h3>
                  <p className="text-sm text-muted-foreground">{college.location}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="icon" variant="outline" onClick={() => editCollege(college)}>
                    <PencilLine className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="danger" onClick={() => removeCollege(college.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-muted/30 p-3">Fees: {college.totalFees.toLocaleString()}</div>
                <div className="rounded-2xl bg-muted/30 p-3">Avg package: {college.averageSalary.toLocaleString()}</div>
                <div className="rounded-2xl bg-muted/30 p-3">Placement: {college.placementRate}%</div>
                <div className="rounded-2xl bg-muted/30 p-3">Featured: {college.featured ? "Yes" : "No"}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
