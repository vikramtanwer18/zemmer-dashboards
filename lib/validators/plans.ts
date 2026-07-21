import { z } from "zod";

export const planSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  duration_days: z.coerce
    .number()
    .int()
    .min(1, "At least 1 day")
    .max(3650, "Too long"),
  description: z.string().max(500).optional().or(z.literal("")),
  max_freeze_days: z.coerce
    .number()
    .int()
    .min(0, "Cannot be negative")
    .max(180, "Max 180 days"),
});
export type PlanInput = z.infer<typeof planSchema>;
