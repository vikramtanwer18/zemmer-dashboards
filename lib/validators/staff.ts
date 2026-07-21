import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d{10,15}$/, "Enter a valid 10-15 digit phone number"),
  instructorType: z.enum(["TRAINER", "COACH"], {
    errorMap: () => ({ message: "Select a role" }),
  }),
  hourlyPrice: z.coerce.number().min(1, "Hourly rate is required"),
  address: z.string().min(5, "Address is required"),
  dob: z.string().optional().or(z.literal("")),
  sex: z.enum(["MALE", "FEMALE", "OTHERS"]).optional(),
  bio: z.string().max(500).optional().or(z.literal("")),
  certificate: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
export type StaffInput = z.infer<typeof staffSchema>;
