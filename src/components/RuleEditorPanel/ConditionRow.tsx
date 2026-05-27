import { useState } from "react";
import styles from "./ConditionRow.module.css";

export interface ConditionRowProps {
  conditionKey: string;
  conditionValue: string;
  onKeyChange: (newKey: string) => void;
  onValueChange: (newValue: string) => void;
  onRemove: () => void;
}

/**
 * ConditionRow renders a single condition key-value pair with inline editing,
 * validation, and a remove control.
 *
 * Layout: [key input] = [value input] [× remove]
 */
export function ConditionRow({
  conditionKey,
  conditionValue,
  onKeyChange,
  onValueChange,
  onRemove,
}: ConditionRowProps) {
  const [keyTouched, setKeyTouched] = useState(false);
  const [valueTouched, setValueTouched] = useState(false);

  const keyError =
    keyTouched && conditionKey.trim().length === 0
      ? "Condition key cannot be empty"
      : null;

  const valueError =
    valueTouched && conditionValue.trim().length === 0
      ? "Condition value cannot be empty"
      : null;

  return (
    <div className={styles.row}>
      <div className={styles.fieldWrapper}>
        <input
          type="text"
          className={`${styles.input} ${keyError ? styles.inputError : ""}`}
          placeholder="key"
          value={conditionKey}
          aria-label="Condition key"
          onChange={(e) => onKeyChange(e.target.value)}
          onBlur={() => setKeyTouched(true)}
        />
        {keyError && (
          <span className={styles.error} role="alert">
            {keyError}
          </span>
        )}
      </div>

      <span className={styles.separator}>=</span>

      <div className={styles.fieldWrapper}>
        <input
          type="text"
          className={`${styles.input} ${valueError ? styles.inputError : ""}`}
          placeholder="value"
          value={conditionValue}
          aria-label="Condition value"
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={() => setValueTouched(true)}
        />
        {valueError && (
          <span className={styles.error} role="alert">
            {valueError}
          </span>
        )}
      </div>

      <button
        type="button"
        className={styles.removeButton}
        onClick={onRemove}
        title="Remove condition"
      >
        x
      </button>
    </div>
  );
}

export default ConditionRow;
