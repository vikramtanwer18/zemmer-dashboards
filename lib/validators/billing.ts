import { z } from "zod";

export const invoiceSchema = z.object({
  member_id: z.string().min(1, "Please select a member"),
  amount_paise: z.coerce.number().min(1, "Amount must be greater than zero"),
  due_date: z.string().min(1, "Due date is required"),
  status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).default("PENDING"),
  grace_days: z.coerce.number().min(0).default(3),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
