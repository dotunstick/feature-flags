import type { Rule } from "../../types";
import { isDefaultRule } from "../../types";
import { VariantInput } from "./VariantInput";
import styles from "./DefaultRuleItem.module.css";

export interface DefaultRuleItemProps {
  rule: Rule;
  ruleIndex: number;
  isHighlighted: boolean;
  onChange: (variant: string) => void;
}

/**
 * DefaultRuleItem renders the default rule's variant input.
 */
export function DefaultRuleItem({
  rule,
  ruleIndex: _ruleIndex,
  isHighlighted,
  onChange,
}: DefaultRuleItemProps) {
  const variant = isDefaultRule(rule) ? rule.default : "";

  return (
    <div
      className={`${styles.container} ${isHighlighted ? styles.highlighted : ""}`}
    >
      <div className={styles.header}>Default Rule</div>
      <VariantInput
        value={variant}
        onChange={onChange}
        label="Default variant"
      />
    </div>
  );
}

export default DefaultRuleItem;
