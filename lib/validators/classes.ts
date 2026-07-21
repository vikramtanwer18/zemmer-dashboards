import { z } from "zod";

const fmt = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const classSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    trainer_id: z.string().min(1, "Select a trainer"),
    starts_at: z.string().min(1, "Start time is required"),
    ends_at: z.string().min(1, "End time is required"),
    capacity: z.coerce
      .number()
      .int()
      .min(1, "At least 1")
      .max(500, "Too large"),
    description: z.string().max(500).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.starts_at).getTime();
    const end = new Date(data.ends_at).getTime();
    if (isNaN(start) || isNaN(end)) return;
    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["ends_at"],
        message: `End (${fmt(data.ends_at)}) must be after start (${fmt(data.starts_at)}). Tip: 12:00 AM is midnight — for noon pick 12:00 PM.`,
      });
    }
  });
export type ClassInput = z.infer<typeof classSchema>;
