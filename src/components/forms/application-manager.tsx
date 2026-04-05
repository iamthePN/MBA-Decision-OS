"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarClock, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { applicationStatusOptions } from "@/lib/constants";
import { applicationSchema } from "@/lib/validations";

type ApplicationItem = {
  id: string;
  collegeId: string;
  status: string;
  deadline: string | null;
  note: string | null;
  feesPaid: number;
  nextStep: string | null;
  college: {
    id: string;
    name: string;
    location: string;
  };
};

type CollegeOption = {
  id: string;
  name: string;
  location: string;
};

const formSchema = applicationSchema.extend({
  deadline: z.string().optional().nullable()
});

type FormValues = z.infer<typeof formSchema>;

export function ApplicationManager({
  colleges,
  applications: initialApplications
}: {
  colleges: CollegeOption[];
  applications: ApplicationItem[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collegeId: colleges[0]?.id,
      status: "DRAFT",
      deadline: "",
      note: "",
      feesPaid: 0,
      nextStep: ""
    }
  });

  const availableColleges = useMemo(
    () => colleges.filter((college) => !applications.some((application) => application.collegeId === college.id)),
    [applications, colleges]
  );

  const addApplication = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to add application");

      setApplications((current) => [payload.application, ...current]);
      reset({ collegeId: availableColleges[0]?.id, status: "DRAFT", deadline: "", note: "", feesPaid: 0, nextStep: "" });
      toast.success("Application added to tracker.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add application");
    } finally {
      setLoading(false);
    }
  });

  async function updateApplication(id: string, data: Partial<ApplicationItem>) {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to update application");
      setApplications((current) => current.map((item) => (item.id === id ? payload.application : item)));
      toast.success("Application updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update application");
    }
  }

  async function removeApplication(id: string) {
    try {
      const response = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to remove application");
      setApplications((current) => current.filter((item) => item.id !== id));
      toast.success("Application removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove application");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Add application</h2>
          </div>
          <form className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" onSubmit={addApplication}>
            <div>
              <Label htmlFor="collegeId">College</Label>
              <Select id="collegeId" {...register("collegeId")}>
                {availableColleges.map((college) => (
                  <option key={college.id} value={college.id}>{college.name} · {college.location}</option>
                ))}
              </Select>
              {errors.collegeId ? <p className="mt-2 text-sm text-danger">{errors.collegeId.message}</p> : null}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register("status")}>
                {applicationStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register("deadline")} />
            </div>
            <div>
              <Label htmlFor="feesPaid">Fees paid</Label>
              <Input id="feesPaid" type="number" {...register("feesPaid", { valueAsNumber: true })} />
            </div>
            <div className="md:col-span-2 xl:col-span-1">
              <Label htmlFor="nextStep">Next step</Label>
              <Input id="nextStep" placeholder="Prepare interview brief" {...register("nextStep")} />
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <Label htmlFor="note">Notes</Label>
              <Textarea id="note" {...register("note")} />
            </div>
            <div>
              <Button disabled={loading || !availableColleges.length} type="submit">{loading ? "Adding..." : "Add application"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{application.college.name}</h3>
                  <p className="text-sm text-muted-foreground">{application.college.location}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    className="w-[180px]"
                    defaultValue={application.status}
                    onChange={(event) => updateApplication(application.id, { status: event.target.value })}
                  >
                    {applicationStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                  <Button type="button" variant="outline" onClick={() => removeApplication(application.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InlineField label="Deadline" value={application.deadline ? format(new Date(application.deadline), "dd MMM yyyy") : "Not set"} icon={<CalendarClock className="h-4 w-4" />} />
                <InlineEditable field="feesPaid" label="Fees paid" initialValue={String(application.feesPaid)} onSave={(value) => updateApplication(application.id, { feesPaid: Number(value) })} />
                <InlineEditable field="nextStep" label="Next step" initialValue={application.nextStep ?? ""} onSave={(value) => updateApplication(application.id, { nextStep: value })} />
                <InlineEditable field="deadline" label="Deadline (YYYY-MM-DD)" initialValue={application.deadline ? format(new Date(application.deadline), "yyyy-MM-dd") : ""} onSave={(value) => updateApplication(application.id, { deadline: value })} />
              </div>
              <InlineTextArea label="Notes" initialValue={application.note ?? ""} onSave={(value) => updateApplication(application.id, { note: value })} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InlineField({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
      <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 font-medium">{icon}{value}</div>
    </div>
  );
}

function InlineEditable({
  label,
  initialValue,
  onSave
}: {
  field: string;
  label: string;
  initialValue: string;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
      <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(event) => setValue(event.target.value)} />
        <Button size="icon" type="button" variant="outline" onClick={() => onSave(value)}>
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function InlineTextArea({ label, initialValue, onSave }: { label: string; initialValue: string; onSave: (value: string) => void }) {
  const [value, setValue] = useState(initialValue);
  return (
    <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
      <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      <Textarea value={value} onChange={(event) => setValue(event.target.value)} />
      <Button className="mt-3" size="sm" type="button" variant="outline" onClick={() => onSave(value)}>
        Save notes
      </Button>
    </div>
  );
}
