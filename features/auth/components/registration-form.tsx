"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FormInput } from "@/components/ui/form-input";
import { useAppDispatch } from "@/store/hooks";
import { registerThunk } from "@/store/slices/auth.slice";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";
import { applyServerFieldErrors } from "@/lib/api/error";

type RegisterFormInput = z.input<typeof registerSchema>;

export const RegistrationForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormInput, unknown, RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      gymName: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    const action = await dispatch(registerThunk(values));
    if (registerThunk.fulfilled.match(action)) {
      toast.success("Account created! Check your email for an OTP.");
      router.push(`/verify-email?email=${encodeURIComponent(values.ownerEmail)}`);
    } else {
      const msg = (action.payload as string) ?? "Unable to register.";
      applyServerFieldErrors<RegisterFormInput>(action.error, setError);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormInput
        label="Gym Name *"
        placeholder="Elite Fitness Center"
        autoComplete="organization"
        error={errors.gymName?.message}
        {...register("gymName")}
      />
      <FormInput
        label="Owner Name *"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.ownerName?.message}
        {...register("ownerName")}
      />
      <FormInput
        label="Email *"
        type="email"
        placeholder="owner@gymos.com"
        autoComplete="email"
        error={errors.ownerEmail?.message}
        {...register("ownerEmail")}
      />
      <FormInput
        label="Phone"
        type="tel"
        placeholder="+91 90000 00000"
        autoComplete="tel"
        error={errors.ownerPhone?.message}
        {...register("ownerPhone")}
      />
      <FormInput
        label="Password *"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormInput
        label="Confirm Password *"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="pt-2">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create Account"}
          {!isSubmitting && <Icon name="arrow_forward" size={20} />}
        </Button>
      </div>
    </form>
  );
};
