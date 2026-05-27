import { MouseEvent } from "react";
import styles from "./DeleteButton.module.css";

export interface DeleteButtonProps {
  flagKey: string;
  onDelete: () => void;
}

/**
 * DeleteButton renders a small delete control for a flag list item.
 * On click it shows a browser confirm dialog; if the user confirms,
 * it calls `onDelete`. If the user cancels, nothing happens.
 *
 */
export function DeleteButton({ flagKey, onDelete }: DeleteButtonProps) {
  function handleClick(e: MouseEvent) {
    // Prevent the click from bubbling up to the FlagListItem row
    e.stopPropagation();

    const confirmed = window.confirm(
      `Delete flag '${flagKey}'? This cannot be undone.`
    );

    if (confirmed) {
      onDelete();
    }
  }

  return (
    <button
      type="button"
      className={styles.deleteButton}
      onClick={handleClick}
      title="Delete flag"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    </button>
  );
}

export default DeleteButton;
