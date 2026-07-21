"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { OtpForm } from "@/features/auth/components/otp-form";
import { useAppDispatch } from "@/store/hooks";
import {
  resendOtpThunk,
  verifyEmailThunk,
} from "@/store/slices/auth.slice";
import { PageLoader } from "@/components/ui/states";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const email = searchParams.get("email") ?? "";
  const [submitting, setSubmitting] = React.useState(false);
  const [resending, setResending] = React.useState(false);

  if (!email) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-on-surface-variant">
          No email provided. Please register first.
        </p>
        <button
          onClick={() => router.push("/register")}
          className="text-primary font-bold hover:underline"
        >
          Go to register
        </button>
      </div>
    );
  }

  const handleSubmit = async (otp: string) => {
    setSubmitting(true);
    const action = await dispatch(verifyEmailThunk({ email, otp }));
    setSubmitting(false);
    if (verifyEmailThunk.fulfilled.match(action)) {
      toast.success("Email verified! Please sign in.");
      router.replace("/login");
    } else {
      toast.error((action.payload as string) ?? "Verification failed.");
    }
  };

  const handleResend = async () => {
    setResending(true);
    const action = await dispatch(resendOtpThunk({ email }));
    setResending(false);
    if (resendOtpThunk.fulfilled.match(action)) {
      toast.success("A new OTP has been sent to your email.");
    } else {
      toast.error((action.payload as string) ?? "Unable to resend OTP.");
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-atmospheric p-8 md:p-12 text-center border border-outline-variant/10">
      <div className="space-y-3 mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
          Verify Your Email
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm mx-auto font-medium">
          Enter the 6-digit code sent to{" "}
          <span className="font-bold text-on-surface">{email}</span>.
        </p>
      </div>

      <OtpForm
        onSubmit={handleSubmit}
        onResend={handleResend}
        submitting={submitting}
        resending={resending}
        submitLabel="Verify Email"
      />

      <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
        <div className="flex items-center gap-1.5">
          <Icon name="lock" size={16} />
          <span className="text-[0.7rem] font-bold tracking-tighter uppercase">
            256-bit AES
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Icon name="verified_user" size={16} />
          <span className="text-[0.7rem] font-bold tracking-tighter uppercase">
            Device Verified
          </span>
        </div>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-lg z-10">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center shadow-lg">
              <Icon name="fitness_center" fill className="text-on-primary" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-primary uppercase">
              GymOS
            </h1>
          </div>
        </div>

        <Suspense fallback={<PageLoader />}>
          <VerifyEmailInner />
        </Suspense>
      </div>
    </main>
  );
}
