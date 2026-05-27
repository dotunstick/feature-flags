import type { EvaluationResult } from "../../types";
import styles from "./EvaluationResultDisplay.module.css";

export interface EvaluationResultDisplayProps {
  result: EvaluationResult;
}

/**
 * Displays the evaluation result in a structured format
 * 
*/
export function EvaluationResultDisplay({ result }: EvaluationResultDisplayProps) {
  const { variant, matchedRuleIndex, explanation } = result;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.label}>Variant:</span>
        <span className={styles.variant}>{variant}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Matched Rule:</span>
        <span className={styles.matchedRule}>
          {matchedRuleIndex !== null ? `Rule ${matchedRuleIndex + 1}` : "None"}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Explanation:</span>
        <span className={styles.explanation}>{explanation}</span>
      </div>
    </div>
  );
}

export default EvaluationResultDisplay;
