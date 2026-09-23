import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import ScrollRigRoot from "./components/scroll-rig/ScrollRigRoot";
import StoryblokProvider from "./components/StoryblokProvider";
import "./globals.css";

const moonGet = localFont({
  src: "./fonts/MoonGet-Heavy.ttf",
  variable: "--font-moon-get",
  weight: "900",
  display: "swap",
  adjustFontFallback: false,
});

const arhaicRomanesc = localFont({
  src: "./fonts/ArhaicRomanesc.ttf",
  variable: "--font-arhaic",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: {
    default: "Colorificio Kroen",
    template: "%s | Colorificio Kroen",
  },
  description:
    "Associazione culturale e spazio eventi a Rovereto — concerti, tesseramento, contatti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = `${moonGet.variable} ${arhaicRomanesc.variable} ${archivo.variable}`;

  return (
    <html lang="it" className={fontVars}>
      <body className={`${fontVars} antialiased`}>
        <StoryblokProvider>
          <ScrollRigRoot />
          {children}
        </StoryblokProvider>
      </body>
    </html>
  );
}
