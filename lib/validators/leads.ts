import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^[0-9+()-\s]+$/, "Enter a valid phone number"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  source: z.enum(["WALK_IN", "WEBSITE", "INSTAGRAM", "REFERRAL"], {
    required_error: "Source is required",
  }),
  stage: z.enum(["NEW", "CONTACTED", "TRIAL", "NEGOTIATION", "WON", "LOST"], {
    required_error: "Stage is required",
  }),
  notes: z.string().max(500).optional().or(z.literal("")),
  assignedTo: z.string().optional().or(z.literal("")),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const followupSchema = z.object({
  followup_at: z.string().refine((v) => {
    if (!v) return false;
    return new Date(v).getTime() > Date.now();
  }, "Must be in the future"),
  note: z.string().max(300).optional().or(z.literal("")),
});
export type FollowupInput = z.infer<typeof followupSchema>;
