import type { Flag, Rule } from "../../types";
import { RuleList } from "./RuleList";
import styles from "./RuleEditorPanel.module.css";

export interface RuleEditorPanelProps {
  flag: Flag | null;
  highlightedRuleIndex: number | null;
  onRulesChange: (key: string, rules: Rule[]) => void;
}

/**
 * RuleEditorPanel renders the centre column of the app layout.
 *
 * - When no flag is selected, it shows a centred empty-state prompt.
 * - When a flag is selected, it shows the flag key as a header and renders
 *   the RuleList for editing the flag's rules.
 */
export function RuleEditorPanel({
  flag,
  highlightedRuleIndex,
  onRulesChange,
}: RuleEditorPanelProps) {
  if (flag === null) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          <p className={styles.emptyStateMessage}>
            Select a flag to begin editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <h2 className={styles.flagKey}>{flag.key}</h2>
      </header>

      <div className={styles.content}>
        <RuleList
          flag={flag}
          highlightedRuleIndex={highlightedRuleIndex}
          onRulesChange={onRulesChange}
        />
      </div>
    </div>
  );
}

export default RuleEditorPanel;
