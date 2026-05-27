export type Variant = string;

export type ConditionMap = Record<string, string>;

export type UserContext = Record<string, string>;

export interface ConditionRule {
  if: ConditionMap;
  then: Variant;
}

export interface DefaultRule {
  default: Variant;
}

export type Rule = ConditionRule | DefaultRule;

/** A feature flag. */
export interface Flag {
  key: string;
  enabled: boolean;
  rules: Rule[];
}

export interface EvaluationResult {
  variant: Variant | "off";
  matchedRuleIndex: number | null;
  explanation: string;
}

export type ValidationResult =
  | { ok: true }
  | { ok: false; field: string; message: string };

export function isDefaultRule(rule: Rule): rule is DefaultRule {
  return "default" in rule;
}

export function isConditionRule(rule: Rule): rule is ConditionRule {
  return "if" in rule && "then" in rule;
}
