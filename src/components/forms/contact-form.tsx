"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/validations";

import type { z } from "zod";

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message received. We will follow up shortly.");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit the form.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Aarav Sharma" {...register("name")} />
              {errors.name ? <p className="mt-2 text-sm text-danger">{errors.name.message}</p> : null}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="you@example.com" type="email" {...register("email")} />
              {errors.email ? <p className="mt-2 text-sm text-danger">{errors.email.message}</p> : null}
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Need help shortlisting colleges" {...register("subject")} />
            {errors.subject ? <p className="mt-2 text-sm text-danger">{errors.subject.message}</p> : null}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Tell us what you need help with." {...register("message")} />
            {errors.message ? <p className="mt-2 text-sm text-danger">{errors.message.message}</p> : null}
          </div>
          <Button className="w-full md:w-auto" disabled={submitting} type="submit">
            {submitting ? "Sending..." : "Send message"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <div className="mt-8 flex items-start gap-3 rounded-3xl bg-muted/50 p-4 text-sm text-muted-foreground">
          <Mail className="mt-0.5 h-4 w-4 text-primary" />
          Contact submissions are stored inside the admin dashboard even when no external email provider is configured.
        </div>
      </CardContent>
    </Card>
  );
}
