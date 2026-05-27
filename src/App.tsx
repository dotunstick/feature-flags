import { useFlagStore } from "./store/flagStore";
import { AppLayout } from "./components/AppLayout/AppLayout";
import { FlagListPanel } from "./components/FlagListPanel/FlagListPanel";
import { RuleEditorPanel } from "./components/RuleEditorPanel/RuleEditorPanel";
import { EvalPanel } from "./components/EvalPanel/EvalPanel";
import { evaluate } from "./evaluator";

function App() {
  const flags = useFlagStore((s) => s.flags);
  const selectedFlagKey = useFlagStore((s) => s.selectedFlagKey);
  const evalResult = useFlagStore((s) => s.evalResult);
  const selectFlag = useFlagStore((s) => s.selectFlag);
  const createFlag = useFlagStore((s) => s.createFlag);
  const deleteFlag = useFlagStore((s) => s.deleteFlag);
  const toggleFlag = useFlagStore((s) => s.toggleFlag);
  const updateRules = useFlagStore((s) => s.updateRules);
  const setEvalResult = useFlagStore((s) => s.setEvalResult);

  const selectedFlag = flags.find((f) => f.key === selectedFlagKey) ?? null;
  const highlightedRuleIndex = evalResult?.matchedRuleIndex ?? null;

  return (
    <>
      <AppLayout
        flagListPanel={
          <FlagListPanel
            flags={flags}
            selectedFlagKey={selectedFlagKey}
            onSelect={selectFlag}
            onCreate={(key) => createFlag(key)}
            onDelete={deleteFlag}
            onToggle={(key) => toggleFlag(key)}
          />
        }
        ruleEditorPanel={
          <RuleEditorPanel
            flag={selectedFlag}
            highlightedRuleIndex={highlightedRuleIndex}
            onRulesChange={updateRules}
          />
        }
        evalPanel={
          <EvalPanel
            flag={selectedFlag}
            onEvaluate={(context) => evaluate(selectedFlag!, context)}
            onResultChange={setEvalResult}
          />
        }
      />
    </>
  );
}

export default App;
