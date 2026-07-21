import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  remember: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    gymName: z.string().min(2, "Gym name is required"),
    ownerName: z.string().min(2, "Owner name is required"),
    ownerEmail: z.string().min(1, "Email is required").email("Enter a valid email"),
    ownerPhone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[+\d][\d\s\-()]{6,}$/.test(val),
        "Enter a valid phone",
      ),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/\d/, "Must contain a digit")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter the full 6-digit code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});
export type OtpInput = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    otp: z.string().length(6, "Enter the full 6-digit code"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/\d/, "Must contain a digit"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
