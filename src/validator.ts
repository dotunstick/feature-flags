import type { ValidationResult } from "./types";

/**
 * Validates a flag key.
 *
 * Rejects:
 * - empty or whitespace-only strings
 * - strings that duplicate an existing key
 */
export function validateFlagKey(
  key: string,
  existingKeys: string[]
): ValidationResult {
  if (key.trim().length === 0) {
    return { ok: false, field: "key", message: "Key cannot be empty" };
  }

  if (existingKeys.includes(key)) {
    return {
      ok: false,
      field: "key",
      message: "A flag with this key already exists",
    };
  }

  return { ok: true };
}


/**
 * Parses a raw JSON string as a UserContext.
 */
export function parseUserContext(
  raw: string
): { ok: true; context: Record<string, string> } | { ok: false; error: string } {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Invalid JSON: ${message}` };
  }

  return { ok: true, context: parsed as Record<string, string> };
}
