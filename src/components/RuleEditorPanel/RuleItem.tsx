import type { ConditionRule } from "../../types";
import styles from "./RuleItem.module.css";

export interface RuleItemProps {
  rule: ConditionRule;
  ruleIndex: number;
  isFirst: boolean;
  isLast: boolean;
  isHighlighted: boolean;
  onChange: (updated: ConditionRule) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/**
 * RuleItem renders a single ConditionRule with up/down reorder controls.
 *
 * - Highlights when the rule is the matched rule from evaluation
 * - Renders condition pairs as editable key/value inputs
 * - Shows inline notice when `rule.if` is empty
 * - Provides controls to add/remove conditions and remove the rule
 * - Up/down buttons allow reordering without drag-and-drop
 */
export function RuleItem({
  rule,
  ruleIndex,
  isFirst,
  isLast,
  isHighlighted,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: RuleItemProps) {
  const conditionEntries = Object.entries(rule.if);

  function handleConditionKeyChange(oldKey: string, newKey: string) {
    const newIf: Record<string, string> = {};
    for (const [k, v] of Object.entries(rule.if)) {
      if (k === oldKey) {
        newIf[newKey] = v;
      } else {
        newIf[k] = v;
      }
    }
    onChange({ ...rule, if: newIf });
  }

  function handleConditionValueChange(key: string, newValue: string) {
    onChange({ ...rule, if: { ...rule.if, [key]: newValue } });
  }

  function handleRemoveCondition(key: string) {
    const newIf = { ...rule.if };
    delete newIf[key];
    onChange({ ...rule, if: newIf });
  }

  function handleAddCondition() {
    let newKey = "";
    let counter = 1;
    while (newKey in rule.if || newKey === "") {
      newKey = `key${counter}`;
      counter++;
    }
    onChange({ ...rule, if: { ...rule.if, [newKey]: "" } });
  }

  function handleVariantChange(variant: string) {
    onChange({ ...rule, then: variant });
  }

  const containerClassName = isHighlighted
    ? `${styles.ruleItem} ${styles.ruleItemHighlighted}`
    : styles.ruleItem;

  return (
    <div className={containerClassName}>
      {/* Header with reorder controls, title, and remove button */}
      <div className={styles.header}>
        <div className={styles.reorderControls}>
          <button
            type="button"
            className={styles.reorderButton}
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label={`Move rule ${ruleIndex + 1} up`}
            title="Move up"
          >
            ▲
          </button>
          <button
            type="button"
            className={styles.reorderButton}
            onClick={onMoveDown}
            disabled={isLast}
            aria-label={`Move rule ${ruleIndex + 1} down`}
            title="Move down"
          >
            ▼
          </button>
        </div>
        <span className={styles.ruleTitle}>Rule {ruleIndex + 1}</span>
        <button
          type="button"
          className={styles.removeRuleButton}
          onClick={onRemove}
        >
          Remove Rule
        </button>
      </div>

      {/* Condition list */}
      <div className={styles.conditionList}>
        {conditionEntries.map(([key, value], index) => (
          <div key={index} className={styles.conditionRow}>
            <input
              type="text"
              className={styles.conditionInput}
              value={key}
              onChange={(e) => handleConditionKeyChange(key, e.target.value)}
              aria-label={`Condition key for rule ${ruleIndex + 1}`}
              placeholder="key"
            />
            <span className={styles.conditionSeparator}>=</span>
            <input
              type="text"
              className={styles.conditionInput}
              value={value}
              onChange={(e) => handleConditionValueChange(key, e.target.value)}
              aria-label={`Condition value for rule ${ruleIndex + 1}`}
              placeholder="value"
            />
            <button
              type="button"
              className={styles.removeConditionButton}
              onClick={() => handleRemoveCondition(key)}
              aria-label={`Remove condition ${key}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add condition button */}
      <button
        type="button"
        className={styles.addConditionButton}
        onClick={handleAddCondition}
      >
        + Add Condition
      </button>

      {/* Variant input */}
      <div className={styles.variantSection}>
        <span className={styles.variantLabel}>Then return:</span>
        <input
          type="text"
          className={styles.variantInput}
          value={rule.then}
          onChange={(e) => handleVariantChange(e.target.value)}
          aria-label={`Variant for rule ${ruleIndex + 1}`}
          placeholder="variant"
        />
      </div>
    </div>
  );
}

export default RuleItem;
