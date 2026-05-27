# Feature Flag Evaluator

A browser-based UI for creating, editing, and evaluating feature flags. Developers and product managers can visually manage targeting rules, reorder them via drag-and-drop, and test evaluation against arbitrary user contexts — all without touching JSON directly.

All state is persisted to `sessionStorage`, so the app is fully self-contained with no backend required. Also always resetting for each session over localStorage.

## Tech Stack

| Category | Tool |
|----------|------|
| Language | TypeScript |
| UI | React 19 |
| Build | Vite - Lightweight, Minimal setup, fast |
| State Management | Zustand - Minimal boilerplate, avoids potentially maintaining multiple contexts and custom state management |
| Styling | CSS Modules - Quick with no need for external dependencies |
| Testing | Vitest - Natural choice to go with Vite, minimal setup |

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Run tests (watch mode)
npm test

# Run tests once
npm run test:run

# Build for production
npm run build
```

## Seed Data

On first launch (or when `sessionStorage` is empty/corrupted), the app loads 5 example flags:

| Flag Key | Enabled | Description |
|----------|---------|-------------|
| `new-dashboard` | ✅ | Multi-condition targeting: returns `variant_b` for enterprise users in us-east, `variant_a` for pro users, otherwise `control` |
| `dark-mode` | ✅ | Single-condition rule: returns `enabled` for beta users, otherwise `disabled` |
| `checkout-v2` | ❌ | Disabled flag with multi-rule targeting by country and plan |
| `maintenance-mode` | ❌ | Disabled flag with only a default rule returning `off` |
| `ai-suggestions` | ✅ | Tiered access: `full` for enterprise, `limited` for pro, otherwise `hidden` |

## Evaluation Algorithm

The evaluator is a pure function that determines which variant a user receives for a given flag:

1. **Disabled check** — If the flag's `enabled` field is `false`, immediately return `"off"` without inspecting any rules.
2. **Walk rules in order** — Iterate through the flag's `rules` array from index 0 upward.
3. **First match wins** — For each Condition Rule, check if every key-value pair in its `if` map exists in the provided `UserContext` with an identical value. The first rule that matches is returned.
4. **Empty condition map** — A rule with an empty `if` object (`{}`) matches every context (vacuous truth).
5. **Case-sensitive equality** — All string comparisons are exact and case-sensitive.
6. **Extra context keys ignored** — Keys in the `UserContext` that are not referenced by a rule's `if` map do not affect matching.
7. **Default fallback** — Every flag's rule list ends with exactly one Default Rule, guaranteeing a result for any enabled flag.

The function returns an `EvaluationResult` containing the resolved `variant`, the `matchedRuleIndex`, and an `explanation`.

## Project Structure

```
src/
├── components/
│   ├── AppLayout/          # Top-level three-panel layout
│   ├── EvalPanel/          # Right panel: context input, evaluate button, result display
│   ├── FlagListPanel/      # Left panel: flag list, toggle, create/delete controls
│   ├── RuleEditorPanel/    # Center panel: rule editing, 
├── store/
│   └── flagStore.ts        # Zustand store with sessionStorage persistence
├── evaluator.ts            # Pure evaluation function
├── evaluator.test.ts       # Unit + property-based tests for the evaluator
├── validator.ts            # Input validation
├── validator.test.ts       # Tests for validation logic
├── seedData.ts             # Initial flag data loaded on first run
├── types.ts                # Shared TypeScript types (Flag, Rule, EvaluationResult, etc.)
├── App.tsx                 # Root React component
└── main.tsx                # Vite entry point
```

## Improvements
- Increased test coverage
- Additional validation (e.g. for new flag names, conditions, variants)
- Improved accessibility
- Sad paths (error toast notifications, session storage availability checks)
- Slicker UI (e.g. Drag and Drop for re-ordering, input modals)
- Formatting/Linting
