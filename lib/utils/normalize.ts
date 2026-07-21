/**
 * Coerce an unknown value into an array we can safely .map / .reduce over.
 * - Arrays pass through.
 * - Plain objects are converted via a provided mapper (e.g. for pipeline /
 *   sources that some backends return as { NEW: 5, CONTACTED: 3 } instead of
 *   [{ stage, count }, ...]).
 * - Anything else becomes [].
 */
export function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return [];
}

/**
 * Normalize a "stage/source breakdown" that the backend may send either as
 *   [{ stage: "NEW", count: 5 }, ...]
 * or
 *   { NEW: 5, CONTACTED: 3 }
 * into the array form.
 */
export function normalizeBreakdown<TKey extends string, TLabel extends string>(
  value: unknown,
  labelKey: TLabel,
): Array<Record<TLabel, TKey> & { count: number }> {
  if (Array.isArray(value)) {
    return value as Array<Record<TLabel, TKey> & { count: number }>;
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([k, v]) => {
      const count =
        typeof v === "number"
          ? v
          : v && typeof v === "object" && "count" in v && typeof (v as { count: unknown }).count === "number"
            ? (v as { count: number }).count
            : 0;
      return { [labelKey]: k, count } as Record<TLabel, TKey> & { count: number };
    });
  }
  return [];
}
