import styles from "./ContextInput.module.css";

export interface ContextInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

/**
 * A controlled multi-line textarea for entering UserContext JSON.
 * Validation error display is handled by the parent EvalPanel.
 */
export function ContextInput({ value, onChange, onBlur }: ContextInputProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="context-input">
        User Context (JSON)
      </label>
      <textarea
        id="context-input"
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={'{ "plan": "pro", "region": "us" }'}
        spellCheck={false}
      />
    </div>
  );
}

export default ContextInput;
