import type { UserContext } from "../../types";
import { parseUserContext } from "../../validator";
import styles from "./EvaluateButton.module.css";

export interface EvaluateButtonProps {
  contextRaw: string;
  onEvaluate: (context: UserContext) => void;
  disabled?: boolean;
}

/**
 * On click, parses the raw context JSON string via `parseUserContext`.
 * If parsing succeeds, clears any previous error and calls `onEvaluate`.
 * If parsing fails, silently ignore.
 */
export function EvaluateButton({
  contextRaw,
  onEvaluate,
  disabled = false,
}: EvaluateButtonProps) {
  function handleClick(): void {
    if (disabled) return;

    const result = parseUserContext(contextRaw);

    if (!result.ok) {
      return;
    }

    onEvaluate(result.context);
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      onClick={handleClick}
      disabled={disabled}
    >
      Evaluate
    </button>
  );
}

export default EvaluateButton;
