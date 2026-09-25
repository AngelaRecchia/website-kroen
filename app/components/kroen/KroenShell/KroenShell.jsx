import KroenCursorRing from "../KroenCursorRing/KroenCursorRing";
import KroenField from "../KroenField/KroenField";
import { KroenFieldProvider } from "../KroenFieldContext";
import { KroenSplashProvider } from "../KroenSplash";
import "./KroenShell.scss";

export default function KroenShell({ children }) {
  return (
    <KroenSplashProvider>
      <KroenFieldProvider>
        <KroenField />
        <KroenCursorRing />
        <div className="kroen-shell">{children}</div>
      </KroenFieldProvider>
    </KroenSplashProvider>
  );
}
