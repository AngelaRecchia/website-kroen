import Footer from "../components/Footer";
import Header from "../components/Header";
import KroenShell from "../components/kroen/KroenShell";
import { getGlobalLayout } from "../lib/storyblok-layout";

export default async function WithLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header: headerBlok, footer: footerBlok } = await getGlobalLayout();

  return (
    <KroenShell>
      {headerBlok && <Header blok={headerBlok} />}
      {children}
      {footerBlok && <Footer blok={footerBlok} />}
    </KroenShell>
  );
}
