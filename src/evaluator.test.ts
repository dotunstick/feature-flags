import { describe, it, expect } from "vitest";
import { evaluate } from "./evaluator";
import type { Flag } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFlag(overrides: Partial<Flag> = {}): Flag {
  return {
    key: "test-flag",
    enabled: true,
    rules: [{ default: "control" }],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Unit tests — evaluator.ts
// ---------------------------------------------------------------------------

describe("evaluate", () => {
  // Requirement 7.5 / 8.1
  it("returns variant 'off' with matchedRuleIndex null when flag is disabled", () => {
    const flag = makeFlag({ enabled: false });
    const result = evaluate(flag, {});
    expect(result.variant).toBe("off");
    expect(result.matchedRuleIndex).toBeNull();
  });

  it("includes the flag key in the explanation when disabled", () => {
    const flag = makeFlag({ key: "my-flag", enabled: false });
    const result = evaluate(flag, {});
    expect(result.explanation).toContain("my-flag");
  });

  // Requirement 8.1 — empty `if` map matches every context
  it("matches an empty condition map against any context", () => {
    const flag = makeFlag({
      rules: [
        { if: {}, then: "variant_a" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, { plan: "free", region: "eu" });
    expect(result.variant).toBe("variant_a");
    expect(result.matchedRuleIndex).toBe(0);
  });

  it("matches an empty condition map against an empty context", () => {
    const flag = makeFlag({
      rules: [
        { if: {}, then: "variant_a" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, {});
    expect(result.variant).toBe("variant_a");
    expect(result.matchedRuleIndex).toBe(0);
  });

  // Requirement 7.2 / 8.3 — first-match semantics
  it("returns the first matching condition rule (first-match semantics)", () => {
    const flag = makeFlag({
      rules: [
        { if: { plan: "pro" }, then: "variant_a" },
        { if: { plan: "pro" }, then: "variant_b" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, { plan: "pro" });
    expect(result.variant).toBe("variant_a");
    expect(result.matchedRuleIndex).toBe(0);
  });

  // Requirement 7.2 — case-sensitive matching
  it("does not match when condition value differs only in casing", () => {
    const flag = makeFlag({
      rules: [
        { if: { plan: "Pro" }, then: "variant_a" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, { plan: "pro" });
    expect(result.variant).toBe("control");
    expect(result.matchedRuleIndex).toBe(1);
  });

  it("matches when condition value casing is exact", () => {
    const flag = makeFlag({
      rules: [
        { if: { plan: "pro" }, then: "variant_a" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, { plan: "pro" });
    expect(result.variant).toBe("variant_a");
    expect(result.matchedRuleIndex).toBe(0);
  });

  // Requirement 7.4 / 8.5 — default fallback
  it("falls back to the default rule when no condition rule matches", () => {
    const flag = makeFlag({
      rules: [
        { if: { plan: "enterprise" }, then: "variant_a" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, { plan: "free" });
    expect(result.variant).toBe("control");
    expect(result.matchedRuleIndex).toBe(1);
  });

  it("returns the default rule when there are no condition rules", () => {
    const flag = makeFlag({
      rules: [{ default: "fallback" }],
    });
    const result = evaluate(flag, {});
    expect(result.variant).toBe("fallback");
    expect(result.matchedRuleIndex).toBe(0);
  });

  // Requirement 8.2 — extra context keys are ignored
  it("ignores extra context keys not referenced in any rule", () => {
    const flag = makeFlag({
      rules: [
        { if: { plan: "pro" }, then: "variant_a" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, { plan: "pro", region: "us", extra: "ignored" });
    expect(result.variant).toBe("variant_a");
    expect(result.matchedRuleIndex).toBe(0);
  });

  // Multi-condition rule — all conditions must match
  it("requires all conditions in a rule to match", () => {
    const flag = makeFlag({
      rules: [
        { if: { plan: "enterprise", region: "us-east" }, then: "variant_b" },
        { default: "control" },
      ],
    });
    // Only one condition matches
    const result = evaluate(flag, { plan: "enterprise", region: "eu-west" });
    expect(result.variant).toBe("control");
  });

  it("matches when all conditions in a multi-condition rule are satisfied", () => {
    const flag = makeFlag({
      rules: [
        { if: { plan: "enterprise", region: "us-east" }, then: "variant_b" },
        { default: "control" },
      ],
    });
    const result = evaluate(flag, { plan: "enterprise", region: "us-east" });
    expect(result.variant).toBe("variant_b");
    expect(result.matchedRuleIndex).toBe(0);
  });

  // Explanation field is always a non-empty string
  it("always returns a non-empty explanation string", () => {
    const flag = makeFlag({ enabled: false });
    expect(evaluate(flag, {}).explanation).toBeTruthy();

    const enabledFlag = makeFlag({ enabled: true });
    expect(evaluate(enabledFlag, {}).explanation).toBeTruthy();
  });
});
