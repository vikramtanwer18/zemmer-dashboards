"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validators/auth";
import { useAppDispatch } from "@/store/hooks";
import { forgotPasswordThunk } from "@/store/slices/auth.slice";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    const action = await dispatch(forgotPasswordThunk(values));
    if (forgotPasswordThunk.fulfilled.match(action)) {
      toast.success("If the email exists, a reset code has been sent.");
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } else {
      toast.error((action.payload as string) ?? "Unable to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface relative overflow-hidden">
      <Header />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">
          <div className="flex flex-col mt-8 items-center mb-10">
            <div className="w-12 h-12 bg-primary rounded-lg mb-6 shadow-lg shadow-primary/20 flex items-center justify-center">
              <Icon name="lock_reset" fill className="text-on-primary" />
            </div>
            <h1 className="text-[2.25rem] font-bold tracking-tighter text-on-surface leading-tight text-center">
              Forgot password?
            </h1>
            <p className="text-on-surface-variant font-medium mt-2 text-center">
              We&apos;ll email you a one-time reset code.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="bg-surface-container-lowest ghost-border rounded-xl p-8 shadow-atmospheric space-y-6"
          >
            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@gym.com"
              icon="mail"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Sending code…" : "Send reset code"}
              {!isSubmitting && <Icon name="send" size={18} />}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-on-surface-variant">
            Remembered it?
            <Link
              href="/login"
              className="text-primary font-bold hover:underline ml-1"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
