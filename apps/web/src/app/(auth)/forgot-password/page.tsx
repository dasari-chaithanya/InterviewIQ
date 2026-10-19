"use client";

import React from "react";
import { AuthCard } from "@/components/forms/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth/auth.service";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setIsSent(true);
      toast.success("Password reset instructions sent!");
    } catch {
      toast.error("Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSent) {
    return (
      <AuthCard
        title="Check your email"
        description="We have sent password reset instructions to your email."
        footerText="Back to"
        footerLinkText="Sign in"
        footerLinkHref="/login"
      >
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or try again.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email address and we will send you instructions to reset your password."
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" type="email" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
