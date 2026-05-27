import { describe, it, expect } from "vitest";
import { validateFlagKey, parseUserContext } from "./validator";

// ---------------------------------------------------------------------------
// validateFlagKey
// ---------------------------------------------------------------------------

describe("validateFlagKey", () => {
  it("rejects an empty string", () => {
    const result = validateFlagKey("", []);
    expect(result.ok).toBe(false);
  });

  it("rejects a whitespace-only string", () => {
    const result = validateFlagKey("   ", []);
    expect(result.ok).toBe(false);
  });

  it("rejects a duplicate key", () => {
    const result = validateFlagKey("existing-flag", ["existing-flag"]);
    expect(result.ok).toBe(false);
  });

  it("accepts a key that is not in the existing keys list", () => {
    const result = validateFlagKey("new-flag", ["other-flag"]);
    expect(result.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseUserContext
// ---------------------------------------------------------------------------

describe("parseUserContext", () => {
  it("accepts a valid flat object with string values", () => {
    const result = parseUserContext('{"plan": "pro", "region": "us"}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.context).toEqual({ plan: "pro", region: "us" });
    }
  });

  it("accepts an empty object", () => {
    const result = parseUserContext("{}");
    expect(result.ok).toBe(true);
  });

  it("rejects invalid JSON", () => {
    const result = parseUserContext("{not valid json}");
    expect(result.ok).toBe(false);
  });
});
