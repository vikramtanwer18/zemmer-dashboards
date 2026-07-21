"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/ui/states";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validators/auth";
import { useAppDispatch } from "@/store/hooks";
import { resetPasswordThunk } from "@/store/slices/auth.slice";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const emailParam = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    const action = await dispatch(
      resetPasswordThunk({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      }),
    );
    if (resetPasswordThunk.fulfilled.match(action)) {
      toast.success("Password reset. Please sign in.");
      router.replace("/login");
    } else {
      toast.error((action.payload as string) ?? "Unable to reset password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-surface-container-lowest ghost-border rounded-xl p-8 shadow-atmospheric space-y-5"
    >
      <FormInput
        label="Email"
        type="email"
        icon="mail"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormInput
        label="6-digit OTP"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        maxLength={6}
        error={errors.otp?.message}
        {...register("otp")}
      />
      <FormInput
        label="New Password"
        type="password"
        icon="lock"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <FormInput
        label="Confirm Password"
        type="password"
        icon="lock"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Resetting…" : "Reset Password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
              <Icon name="password" fill className="text-on-primary" />
            </div>
            <h1 className="text-[2.25rem] font-bold tracking-tighter text-on-surface leading-tight text-center">
              Reset password
            </h1>
            <p className="text-on-surface-variant font-medium mt-2 text-center">
              Enter the code from your inbox.
            </p>
          </div>

          <Suspense fallback={<PageLoader />}>
            <ResetPasswordInner />
          </Suspense>

          <p className="text-center mt-8 text-sm font-medium text-on-surface-variant">
            Back to
            <Link href="/login" className="text-primary font-bold hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
