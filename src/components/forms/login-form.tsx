"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password
    });

    setSubmitting(false);

    if (result?.error) {
      toast.error("Invalid credentials. Try the seeded admin or student account from the docs.");
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/portal");
    router.refresh();
  });

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Sign in to MBA Decision OS</CardTitle>
        <CardDescription>Access recommendations, ROI forecasts, and your application command center.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="student@mbadecisionos.dev" {...register("email")} />
            {errors.email ? <p className="mt-2 text-sm text-danger">{errors.email.message}</p> : null}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password ? <p className="mt-2 text-sm text-danger">{errors.password.message}</p> : null}
          </div>
          <Button className="w-full" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          New here?{" "}
          <Link className="font-medium text-primary hover:underline" href="/register">
            Create a student account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

