"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validations";

const formSchema = registerSchema.extend({
  confirmPassword: z.string().min(8)
}).refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match"
});

type RegisterValues = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to register account");
      }

      toast.success("Account created. You can sign in now.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to register account");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start with a student workspace and grow into a full decision intelligence workflow.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Ananya Patel" {...register("name")} />
            {errors.name ? <p className="mt-2 text-sm text-danger">{errors.name.message}</p> : null}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email ? <p className="mt-2 text-sm text-danger">{errors.email.message}</p> : null}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              {errors.password ? <p className="mt-2 text-sm text-danger">{errors.password.message}</p> : null}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
              {errors.confirmPassword ? <p className="mt-2 text-sm text-danger">{errors.confirmPassword.message}</p> : null}
            </div>
          </div>
          <Button className="w-full" disabled={submitting} type="submit">
            {submitting ? "Creating account..." : "Create account"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
