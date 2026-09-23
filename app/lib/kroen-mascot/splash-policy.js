/** Quando mostrare la splash — trigger definitivo TBD; estendere shouldPlaySplash(). */
const STORAGE_KEY = "kroen-splash-seen";

export function shouldPlaySplash() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.has("nosplash")) return false;
  if (params.has("splash")) return true;
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return false;
  } catch {
    /* ignore */
  }
  return true;
}

export function markSplashSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}
