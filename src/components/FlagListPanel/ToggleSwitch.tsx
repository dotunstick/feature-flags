import styles from "./ToggleSwitch.module.css";

export interface ToggleSwitchProps {
  /** Whether the toggle is in the on (checked) state. */
  checked: boolean;
  /** Called when the user activates the toggle (click or keyboard). */
  onChange: () => void;
  /** Optional accessible label. Rendered as a visually-hidden span. */
  label?: string;
}

/**
 * ToggleSwitch renders an accessible pill-shaped toggle button.
 *
 * Accessibility:
 * - Uses `role="switch"` and `aria-checked` per ARIA 1.1 spec.
 * - Responds to Space and Enter keys (native button behaviour).
 * - Provides a visible focus ring via `:focus-visible`.
 *
 * The parent component is responsible for error display; this component
 * simply calls `onChange` when activated.
 */
export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={styles.toggle}
      onClick={(e) => {
        // Prevent the click from bubbling up to the FlagListItem row
        e.stopPropagation();
        onChange();
      }}
      onKeyDown={(e) => {
        // Space is handled natively by <button>; Enter is also standard.
        // Prevent page scroll on Space.
        if (e.key === " ") {
          e.preventDefault();
        }
      }}
    >
      <span className={styles.track} />
      {label && <span>{label}</span>}
    </button>
  );
}

export default ToggleSwitch;
