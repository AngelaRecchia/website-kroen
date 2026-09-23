import KroenShell from "../components/kroen/KroenShell";

/** Anteprima Storyblok (layout-components): stesso container + WebGL delle pagine reali */
export default function WithoutLayoutPreview({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <KroenShell>{children}</KroenShell>;
}
