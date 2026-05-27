import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Flag, Rule, EvaluationResult, ValidationResult } from "../types";
import { isDefaultRule } from "../types";
import { SEED_FLAGS } from "../seedData";

// ---------------------------------------------------------------------------
// Schema validation for persisted data
// ---------------------------------------------------------------------------

/**
 * Validates that a parsed value conforms to the Flag[] schema.
 * Checks:
 * - top-level value is an array
 * - each item has `key` (string), `enabled` (boolean), `rules` (array)
 * - each item's `rules` array ends with exactly one DefaultRule
 */
function isValidFlagArray(value: unknown): value is Flag[] {
  if (!Array.isArray(value)) return false;

  for (const item of value) {
    if (typeof item !== "object" || item === null) return false;

    const flag = item as Record<string, unknown>;

    if (typeof flag.key !== "string") return false;
    if (typeof flag.enabled !== "boolean") return false;
    if (!Array.isArray(flag.rules)) return false;
    if (flag.rules.length === 0) return false;

    const lastRule = flag.rules[flag.rules.length - 1];
    if (!isDefaultRule(lastRule as Rule)) return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Store state and actions interface
// ---------------------------------------------------------------------------

export interface FlagStoreState {
  flags: Flag[];
  selectedFlagKey: string | null;
  evalResult: EvaluationResult | null;

  // Actions
  selectFlag: (key: string | null) => void;
  createFlag: (customKey?: string) => void;
  deleteFlag: (key: string) => void;
  toggleFlag: (key: string) => ValidationResult;
  updateFlag: (key: string, updated: Flag) => ValidationResult;
  updateRules: (key: string, rules: Rule[]) => ValidationResult;
  setEvalResult: (result: EvaluationResult | null) => void;
}

// ---------------------------------------------------------------------------
// Persistence storage key
// ---------------------------------------------------------------------------

const STORAGE_KEY = "feature-flag-evaluator:flags";

// ---------------------------------------------------------------------------
// Zustand store
// ---------------------------------------------------------------------------

export const useFlagStore = create<FlagStoreState>()(
  persist(
    (set, get) => ({
      // -----------------------------------------------------------------------
      // Initial state
      // -----------------------------------------------------------------------
      flags: SEED_FLAGS,
      selectedFlagKey: null,
      evalResult: null,

      // -----------------------------------------------------------------------
      // Actions
      // -----------------------------------------------------------------------

      /**
       * Selects a flag by key (or deselects when null).
       * Clears the current eval result when selection changes.
       */
      selectFlag: (key: string | null) => {
        set({ selectedFlagKey: key, evalResult: null });
      },

      /**
       * Creates a new flag with the given key (or a generated one),
       * `enabled: false`, and a single default rule `{ default: "control" }`.
       * Selects the new flag after creation.
       */
      createFlag: (customKey?: string) => {
        const key = customKey || `new-flag-${Date.now()}`;
        const newFlag: Flag = {
          key,
          enabled: false,
          rules: [{ default: "control" }],
        };
        set((state) => ({
          flags: [...state.flags, newFlag],
          selectedFlagKey: key,
          evalResult: null,
        }));
      },

      /**
       * Deletes the flag with the given key.
       * If the deleted flag was selected, clears the selection.
       */
      deleteFlag: (key: string) => {
        set((state) => ({
          flags: state.flags.filter((f) => f.key !== key),
          selectedFlagKey:
            state.selectedFlagKey === key ? null : state.selectedFlagKey,
          evalResult:
            state.selectedFlagKey === key ? null : state.evalResult,
        }));
      },

      /**
       * Toggles the `enabled` field of the flag with the given key.
       */
      toggleFlag: (key: string): ValidationResult => {
        const { flags } = get();
        const flagIndex = flags.findIndex((f) => f.key === key);

        if (flagIndex === -1) {
          return { ok: false, field: "key", message: "Flag not found" };
        }

        const flag = flags[flagIndex];
        const toggled: Flag = { ...flag, enabled: !flag.enabled };

        const updatedFlags = [...flags];
        updatedFlags[flagIndex] = toggled;
        set({ flags: updatedFlags });

        return { ok: true };
      },

      /**
       * Replaces the flag identified by `key` with `updated`.
       */
      updateFlag: (key: string, updated: Flag): ValidationResult => {
        const { flags } = get();
        const flagIndex = flags.findIndex((f) => f.key === key);

        if (flagIndex === -1) {
          return { ok: false, field: "key", message: "Flag not found" };
        }

        const updatedFlags = [...flags];
        updatedFlags[flagIndex] = updated;
        set({
          flags: updatedFlags,
          // Clear eval result when the flag itself changes
          evalResult: null,
        });

        return { ok: true };
      },

      /**
       * Replaces the rules of the flag identified by `key` with `rules`.
       * Persists immediately to support inline editing (Req 6.13).
       * Structural validation (rules array ends with DefaultRule) is checked,
       * but variant/condition content validation is left to the UI layer
       * so that intermediate editing states (empty variants) are allowed.
       */
      updateRules: (key: string, rules: Rule[]): ValidationResult => {
        const { flags } = get();
        const flagIndex = flags.findIndex((f) => f.key === key);

        if (flagIndex === -1) {
          return { ok: false, field: "key", message: "Flag not found" };
        }

        // Structural check only: rules must be non-empty and end with a DefaultRule
        if (rules.length === 0) {
          return { ok: false, field: "rules", message: "Rules array must end with exactly one Default Rule" };
        }

        const lastRule = rules[rules.length - 1];
        if (!("default" in lastRule)) {
          return { ok: false, field: "rules", message: "Rules array must end with exactly one Default Rule" };
        }

        const flag = flags[flagIndex];
        const updated: Flag = { ...flag, rules };

        const updatedFlags = [...flags];
        updatedFlags[flagIndex] = updated;
        set({
          flags: updatedFlags,
          // Clear eval result when rules change
          evalResult: null,
        });

        return { ok: true };
      },

      /**
       * Sets the current evaluation result (or clears it with null).
       */
      setEvalResult: (result: EvaluationResult | null) => {
        set({ evalResult: result });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      // Persist flags and selectedFlagKey so the user's selection survives refresh.
      partialize: (state) => ({
        flags: state.flags,
        selectedFlagKey: state.selectedFlagKey,
      }),
      // Validate the stored data on rehydration; fall back to seed data if
      // the stored value is corrupt or does not conform to the Flag[] schema.
      merge: (persisted, current) => {
        const persistedState = persisted as { flags?: unknown; selectedFlagKey?: unknown } | null;
        const flags =
          persistedState &&
          typeof persistedState === "object" &&
          isValidFlagArray(persistedState.flags)
            ? persistedState.flags
            : SEED_FLAGS;

        const selectedFlagKey =
          persistedState &&
          typeof persistedState === "object" &&
          typeof persistedState.selectedFlagKey === "string" &&
          flags.some((f: Flag) => f.key === persistedState.selectedFlagKey)
            ? (persistedState.selectedFlagKey as string)
            : null;

        return { ...current, flags, selectedFlagKey };
      },
    }
  )
);
