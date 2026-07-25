/**
 * Pull a human-readable message off a caught value.
 *
 * `catch` hands back `unknown` — it is not guaranteed to be an Error, so
 * reading `.message` directly is only safe after a check. Typing the binding
 * as `any` hides that; this keeps the check in one place.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
}
