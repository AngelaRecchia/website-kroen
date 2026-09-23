import KroenCursorRing from "./KroenCursorRing";
import KroenFabDock from "./KroenFabDock";
import KroenField from "./KroenField";
import { KroenFieldProvider } from "./KroenFieldContext";

export default function KroenShell({ children }) {
  return (
    <KroenFieldProvider>
      <KroenField />
      <KroenCursorRing />
      <div className="kroen-shell">{children}</div>
      <KroenFabDock />
    </KroenFieldProvider>
  );
}
