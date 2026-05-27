import { useState } from "react";
import styles from "./VariantInput.module.css";

export interface VariantInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/**
 * VariantInput is a controlled text input that shows an inline validation
 * error when the value is empty or whitespace-only.
 * It calls onChange on every keystroke — the parent decides when to persist.
 */
export function VariantInput({ value, onChange, label }: VariantInputProps) {
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && value.trim().length === 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleBlur() {
    setTouched(true);
  }

  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        type="text"
        className={`${styles.input} ${isInvalid ? styles.inputError : ""}`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={label ?? "Variant"}
        aria-invalid={isInvalid}
      />
      {isInvalid && (
        <p className={styles.error} role="alert">
          Variant cannot be empty
        </p>
      )}
    </div>
  );
}

export default VariantInput;
