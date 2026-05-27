import React from "react";
import type { Flag } from "../../types";
import { ToggleSwitch } from "./ToggleSwitch";
import { DeleteButton } from "./DeleteButton";
import styles from "./FlagListItem.module.css";

export interface FlagListItemProps {
  flag: Flag;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

/**
 * FlagListItem renders a single flag row in the FlagListPanel.
 *
 * - Displays the flag key and enabled/disabled status badge.
 * - Highlights the row with an accent border when `isSelected` is true.
 * - Calls `onSelect` when the row itself is clicked.
 * - Renders `ToggleSwitch` and `DeleteButton` as child controls; clicks on
 *   those controls do NOT bubble up to the row's `onSelect` handler.
 *
 */
export function FlagListItem({
  flag,
  isSelected,
  onSelect,
  onToggle,
  onDelete,
}: FlagListItemProps) {
  const rowClassName = [
    styles.item,
    isSelected ? styles.selected : "",
    !flag.enabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * Stop click events originating from the controls area from bubbling up
   * to the row's onClick handler, so that toggling or deleting a flag does
   * not simultaneously select it (or deselect the current selection).
   */
  function handleControlsClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className={rowClassName}
      onClick={onSelect}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Flag key */}
      <span className={styles.flagKey} title={flag.key}>
        {flag.key}
      </span>

      {/* Enabled / disabled status badge */}
      <span className={styles.statusBadge}>
        {flag.enabled ? "on" : "off"}
      </span>

      {/* Controls — clicks here must not trigger onSelect */}
      <div className={styles.controls} onClick={handleControlsClick}>
        <ToggleSwitch checked={flag.enabled} onChange={onToggle} />
        <DeleteButton flagKey={flag.key} onDelete={onDelete} />
      </div>
    </div>
  );
}

export default FlagListItem;
