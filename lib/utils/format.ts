import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(value: string | Date | null | undefined, pattern = "MMM d, yyyy"): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  if (isNaN(date.getTime())) return "—";
  return format(date, pattern);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  return formatDate(value, "MMM d, yyyy · h:mm a");
}

export function formatRelative(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  if (isNaN(date.getTime())) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(rupees: number | null | undefined): string {
  if (rupees == null || isNaN(rupees)) return "—";
  return INR.format(rupees);
}

export function formatPaise(paise: number | null | undefined): string {
  if (paise == null) return "—";
  return formatCurrency(paise / 100);
}

export function initialsFromName(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0m";

  const years = Math.floor(minutes / (60 * 24 * 365));
  let rem = minutes % (60 * 24 * 365);

  const months = Math.floor(rem / (60 * 24 * 30));
  rem %= (60 * 24 * 30);

  const days = Math.floor(rem / (60 * 24));
  rem %= (60 * 24);

  const hours = Math.floor(rem / 60);
  const mins = Math.round(rem % 60);

  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}mo`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);

  return parts.join(" ") || "0m";
}
