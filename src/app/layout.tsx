import "./globals.css";

import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";

import Providers from "./providers";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Star Wars Galaxy Explorer",
    template: "%s | Star Wars Galaxy Explorer",
  },
  description:
    "Explore the Star Wars universe — characters, films, planets, species, starships and vehicles from the Saga.",
  icons: { icon: "/logo.jpg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased custom-scrollbar">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
