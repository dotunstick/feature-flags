import { useState } from "react";
import type { Flag, UserContext, EvaluationResult } from "../../types";
import { ContextInput } from "./ContextInput";
import { EvaluateButton } from "./EvaluateButton";
import { EvaluationResultDisplay } from "./EvaluationResultDisplay";
import styles from "./EvalPanel.module.css";

export interface EvalPanelProps {
  flag: Flag | null;
  onEvaluate: (context: UserContext) => EvaluationResult;
  onResultChange: (result: EvaluationResult | null) => void;
}

/**
 * EvalPanel hosts the evaluation workflow: enter a UserContext JSON string,
 * click Evaluate, and see the result with the matched rule highlighted.
 *
 * No flag selected: shows a prompt and a disabled EvaluateButton.
 *
 * Flag selected: shows ContextInput, EvaluateButton, and EvaluationResultDisplay.
 */
export function EvalPanel({
  flag,
  onEvaluate,
  onResultChange,
}: EvalPanelProps) {
  // Local state for the raw context JSON string entered by the user.
  // Persisted to sessionStorage so it survives page refreshes.
  const CONTEXT_STORAGE_KEY = "feature-flag-evaluator:context";
  const [contextRaw, setContextRaw] = useState<string>(() => {
    try {
      return sessionStorage.getItem(CONTEXT_STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  // Local state for the current evaluation result
  const [result, setResult] = useState<EvaluationResult | null>(null);
  // Local state for any evaluation-level error (e.g. JSON parse failure)
  const [evalError, setEvalError] = useState<string | null>(null);

  /**
   * Called by EvaluateButton after it has successfully parsed the context.
   * Runs the evaluator and propagates the result upward.
   */
  function handleEvaluate(context: UserContext): void {
    const evalResult = onEvaluate(context);
    setResult(evalResult);
    setEvalError(null);
    onResultChange(evalResult);
  }

  /**
   * Called when the context input changes. Clears any stale result so the
   * displayed result always corresponds to the current input.
   */
  function handleContextChange(raw: string): void {
    setContextRaw(raw);
    if (result !== null) {
      setResult(null);
      onResultChange(null);
    }
  }

  return (
    <div className={styles.panel}>
      {flag === null ? (
        // No flag selected — show prompt and disabled button
        <div className={styles.noFlagState}>
          <p className={styles.noFlagPrompt}>Select a flag to evaluate</p>
          <EvaluateButton
            contextRaw={contextRaw}
            onEvaluate={handleEvaluate}
            disabled
          />
        </div>
      ) : (
        // Flag selected — show full evaluation UI
        <div className={styles.content}>
          <ContextInput
            value={contextRaw}
            onChange={handleContextChange}
            onBlur={() => {
              try {
                sessionStorage.setItem(CONTEXT_STORAGE_KEY, contextRaw);
              } catch {
                // Ignore storage errors
              }
            }}
          />
          <EvaluateButton
            contextRaw={contextRaw}
            onEvaluate={handleEvaluate}
          />
          {evalError && (
            <p className={styles.evalError} role="alert">
              {evalError}
            </p>
          )}
          {result && (
            <EvaluationResultDisplay result={result} />
          )}
        </div>
      )}
    </div>
  );
}

export default EvalPanel;
