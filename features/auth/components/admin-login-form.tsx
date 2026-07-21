"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { FormInput } from "@/components/ui/form-input";
import { useAppDispatch } from "@/store/hooks";
import { 
  adminLoginThunk 
} from "@/store/slices/auth.slice";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { applyServerFieldErrors } from "@/lib/api/error";


export const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: LoginInput) => {
    const action = await dispatch(
      adminLoginThunk({ email: values.email, password: values.password }),
    );
    if (adminLoginThunk.fulfilled.match(action)) {
      toast.success("Admin login successful!");
      const next = searchParams.get("next") ?? "/admin/dashboard";
      router.replace(next.startsWith("/") ? next : "/admin/dashboard");
    } else {
      const msg = (action.payload as string) ?? "Admin access denied.";
      applyServerFieldErrors<LoginInput>(action.error, setError);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <FormInput
        label="Admin Email"
        type="email"
        placeholder="admin@gym.com"
        icon="mail"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="block text-[0.75rem] font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
            Password
          </span>
          <Link
            href="/forgot-password"
            className="text-[0.75rem] font-semibold text-primary hover:underline transition-all"
          >
            Forgot password?
          </Link>
        </div>
        <FormInput
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          icon="lock"
          autoComplete="current-password"
          error={errors.password?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
            </button>
          }
          {...register("password")}
        />
      </div>

      <Checkbox
        id="remember"
        label="Remember this device"
        {...register("remember")}
      />

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Login"}
        {!isSubmitting && <Icon name="arrow_forward" size={18} />}
      </Button>
    </form>
  );
};

