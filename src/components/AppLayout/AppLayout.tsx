import { ReactNode } from "react";
import styles from "./AppLayout.module.css";

export interface AppLayoutProps {
  flagListPanel: ReactNode;
  ruleEditorPanel: ReactNode;
  evalPanel: ReactNode;
}

export function AppLayout({
  flagListPanel,
  ruleEditorPanel,
  evalPanel,
}: AppLayoutProps) {
  return (
    <div
      className={styles.layout}
    >
      <aside className={styles.flagListColumn}>
        {flagListPanel}
      </aside>

      <main className={styles.ruleEditorColumn}>
        {ruleEditorPanel}
      </main>

      <aside className={styles.evalColumn}>
        {evalPanel}
      </aside>
    </div>
  );
}

export default AppLayout;
