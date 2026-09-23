import KroenCursorRing from "./KroenCursorRing";
import KroenField from "./KroenField";
import KroenFieldDebug from "./KroenFieldDebug";
import { KroenFieldProvider } from "./KroenFieldContext";
import { KroenSplashProvider } from "./KroenSplash";

export default function KroenShell({ children }) {
  return (
    <KroenSplashProvider>
      <KroenFieldProvider>
        <KroenField />
        <KroenFieldDebug />
        <KroenCursorRing />
        <div className="kroen-shell">{children}</div>
      </KroenFieldProvider>
    </KroenSplashProvider>
  );
}
