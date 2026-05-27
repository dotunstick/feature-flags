import type { Flag } from "../../types";
import { FlagListItem } from "./FlagListItem";
import { CreateFlagButton } from "./CreateFlagButton";
import styles from "./FlagListPanel.module.css";

export interface FlagListPanelProps {
  flags: Flag[];
  selectedFlagKey: string | null;
  onSelect: (key: string) => void;
  onCreate: (key: string) => void;
  onDelete: (key: string) => void;
  onToggle: (key: string) => void;
}

/**
 * FlagListPanel renders the left-hand column of the app layout.
 * It shows a scrollable list of all feature flags and a button to create new ones.
 */
export function FlagListPanel({
  flags,
  selectedFlagKey,
  onSelect,
  onCreate,
  onDelete,
  onToggle,
}: FlagListPanelProps) {
  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <h1 className={styles.title}>Feature Flags</h1>
      </header>

      <ul className={styles.list} role="listbox">
        {flags.map((flag) => (
          <FlagListItem
            key={flag.key}
            flag={flag}
            isSelected={flag.key === selectedFlagKey}
            onSelect={() => onSelect(flag.key)}
            onDelete={() => onDelete(flag.key)}
            onToggle={() => onToggle(flag.key)}
          />
        ))}
      </ul>

      <div className={styles.footer}>
        <CreateFlagButton
          onCreate={onCreate}
          existingKeys={flags.map((f) => f.key)}
        />
      </div>
    </div>
  );
}

export default FlagListPanel;
