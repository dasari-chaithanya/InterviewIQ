"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthCard } from "@/components/forms/auth-card";
import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { authService } from "@/services/auth/auth.service";
import { toast } from "sonner";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { password: "", confirmPassword: "" } });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await authService.resetPassword(token, values.password);
      toast.success("Password reset successfully");
      router.push("/login");
    } catch {
      toast.error("This reset link is invalid or expired.");
    }
  }

  return (
    <AuthCard title="Create a new password" description="Choose a new password for your account." footerText="Remember your password?" footerLinkText="Sign in" footerLinkHref="/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>New password</FormLabel><FormControl><PasswordInput {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><FormLabel>Confirm password</FormLabel><FormControl><PasswordInput {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" className="w-full" disabled={!token}>Reset password</Button>
        </form>
      </Form>
    </AuthCard>
  );
}