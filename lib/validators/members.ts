import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(7, "Phone is required")
    .regex(/^[+\d][\d\s\-()]{6,}$/, "Enter a valid phone"),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "CHURNED"]).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});
export type MemberInput = z.infer<typeof memberSchema>;

export const membershipSchema = z.object({
  member_id: z.string().min(1, "Member is required"),
  plan_id: z.string().min(1, "Plan is required"),
  start_date: z.string().min(1, "Start date is required"),
  status: z.enum(["ACTIVE", "FROZEN", "EXPIRED", "SUSPENDED"]).optional(),
});
export type MembershipInput = z.infer<typeof membershipSchema>;

export const freezeSchema = z.object({
  duration_days: z.coerce
    .number()
    .int()
    .min(1, "At least 1 day")
    .max(90, "Max 90 days"),
  reason: z.string().max(300).optional().or(z.literal("")),
});
export type FreezeInput = z.infer<typeof freezeSchema>;
