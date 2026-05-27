import styles from "./CreateFlagButton.module.css";
import { validateFlagKey } from "../../validator";

export interface CreateFlagButtonProps {
  onCreate: (key: string) => void;
  existingKeys: string[];
}

/**
 * CreateFlagButton renders a New Flag button at the bottom
 * of the FlagListPanel. On click it prompts the user for a flag name,
 * validates it, and calls `onCreate` with the validated key.
 */
export function CreateFlagButton({ onCreate, existingKeys }: CreateFlagButtonProps) {
  function handleClick() {
    const input = window.prompt("Enter a flag key (letters, numbers, hyphens, underscores):");
    if (input === null) return; // cancelled

    const key = input.trim();
    const result = validateFlagKey(key, existingKeys);

    if (!result.ok) {
      window.alert(result.message);
      return;
    }

    onCreate(key);
  }

  return (
    <button
      type="button"
      className={styles.createButton}
      onClick={handleClick}
    >
      Add New Flag
    </button>
  );
}

export default CreateFlagButton;
