import { ApiError } from "./types";

export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}

export function applyServerFieldErrors<T extends Record<string, unknown>>(
  err: unknown,
  setError: (name: keyof T, error: { type: string; message: string }) => void,
) {
  if (!(err instanceof ApiError) || !err.fieldErrors) return;
  for (const [field, msg] of Object.entries(err.fieldErrors)) {
    const message = Array.isArray(msg) ? msg[0] : msg;
    if (message) {
      setError(field as keyof T, { type: "server", message });
    }
  }
}
