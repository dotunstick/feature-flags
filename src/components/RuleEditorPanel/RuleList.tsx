import type { Flag, Rule, ConditionRule } from "../../types";
import { isConditionRule } from "../../types";
import { RuleItem } from "./RuleItem";
import { DefaultRuleItem } from "./DefaultRuleItem";
import styles from "./RuleList.module.css";

export interface RuleListProps {
  flag: Flag;
  highlightedRuleIndex: number | null;
  onRulesChange: (key: string, rules: Rule[]) => void;
}

/**
 * RuleList renders the ordered list of rules for a flag.
 *
 * - ConditionRules can be reordered via up/down arrow buttons.
 * - The DefaultRule is always rendered last and is not reorderable.
 * - An "Add Rule" button inserts a new ConditionRule just above the DefaultRule.
 */
export function RuleList({
  flag,
  highlightedRuleIndex,
  onRulesChange,
}: RuleListProps) {
  const { rules } = flag;

  // Separate condition rules from the default rule (always last)
  const conditionRules = rules.filter(isConditionRule);
  const defaultRule = rules[rules.length - 1];

  function handleMoveUp(index: number) {
    if (index <= 0) return;
    const reordered = [...conditionRules];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    const newRules: Rule[] = [...reordered, defaultRule];
    onRulesChange(flag.key, newRules);
  }

  function handleMoveDown(index: number) {
    if (index >= conditionRules.length - 1) return;
    const reordered = [...conditionRules];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    const newRules: Rule[] = [...reordered, defaultRule];
    onRulesChange(flag.key, newRules);
  }

  function handleAddRule() {
    const newConditionRule: ConditionRule = { if: {}, then: "" };
    const newRules: Rule[] = [
      ...rules.slice(0, rules.length - 1),
      newConditionRule,
      defaultRule,
    ];
    onRulesChange(flag.key, newRules);
  }

  function handleConditionRuleChange(ruleIndex: number, updated: ConditionRule) {
    const newRules = [...rules];
    newRules[ruleIndex] = updated;
    onRulesChange(flag.key, newRules);
  }

  function handleRemoveRule(ruleIndex: number) {
    const newRules = rules.filter((_, i) => i !== ruleIndex);
    onRulesChange(flag.key, newRules);
  }

  function handleDefaultRuleChange(variant: string) {
    const newRules = [...rules];
    newRules[newRules.length - 1] = { default: variant };
    onRulesChange(flag.key, newRules);
  }

  return (
    <div className={styles.ruleList}>
      {conditionRules.map((rule, index) => (
        <RuleItem
          key={`rule-${index}`}
          rule={rule}
          ruleIndex={index}
          isFirst={index === 0}
          isLast={index === conditionRules.length - 1}
          isHighlighted={highlightedRuleIndex === index}
          onChange={(updated: ConditionRule) => handleConditionRuleChange(index, updated)}
          onRemove={() => handleRemoveRule(index)}
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
        />
      ))}

      <DefaultRuleItem
        rule={defaultRule}
        ruleIndex={rules.length - 1}
        isHighlighted={highlightedRuleIndex === rules.length - 1}
        onChange={handleDefaultRuleChange}
      />

      <button
        type="button"
        className={styles.addRuleButton}
        onClick={handleAddRule}
      >
        Add Rule
      </button>
    </div>
  );
}

export default RuleList;
