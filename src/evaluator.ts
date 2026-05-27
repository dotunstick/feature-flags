import type { Flag, UserContext, EvaluationResult } from "./types";
import { isDefaultRule, isConditionRule } from "./types";

/**
 * Pure evaluation function. Walks a flag's rules in order and returns the
 * first matching EvaluationResult.
 *
 * - If the flag is disabled, returns variant "off" immediately.
 * - A ConditionRule matches when every key-value pair in its `if` map is
 *   present in the UserContext with a case-sensitive string-equal value.
 * - An empty `if` map matches every context (vacuous truth).
 * - Extra UserContext keys that are not referenced in a rule's `if` map are
 *   ignored.
 * - The DefaultRule always matches and guarantees a result for enabled flags.
 */
export function evaluate(flag: Flag, context: UserContext): EvaluationResult {
  if (!flag.enabled) {
    return {
      variant: "off",
      matchedRuleIndex: null,
      explanation: `Flag "${flag.key}" is disabled.`,
    };
  }

  for (let i = 0; i < flag.rules.length; i++) {
    const rule = flag.rules[i];

    if (isDefaultRule(rule)) {
      return {
        variant: rule.default,
        matchedRuleIndex: i,
        explanation: `No condition rule matched; the default rule at index ${i} was used (variant: "${rule.default}").`,
      };
    }

    if (isConditionRule(rule)) {
      const conditions = rule.if;
      const conditionEntries = Object.entries(conditions);

      const matches = conditionEntries.every(
        ([key, expectedValue]) => context[key] === expectedValue
      );

      if (matches) {
        const matchedConditions =
          conditionEntries.length > 0
            ? conditionEntries
                .map(([k, v]) => `${k}="${v}"`)
                .join(", ")
            : "(empty condition — matches all contexts)";

        return {
          variant: rule.then,
          matchedRuleIndex: i,
          explanation: `Condition rule at index ${i} matched (${matchedConditions}); variant: "${rule.then}".`,
        };
      }
    }
  }

  return {
    variant: "off",
    matchedRuleIndex: null,
    explanation: `Flag "${flag.key}" has no matching rule and no default rule.`,
  };
}
