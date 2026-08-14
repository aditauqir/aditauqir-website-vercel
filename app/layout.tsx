import type { Metadata } from "next";
import { Source_Code_Pro, Trispace } from "next/font/google";

import "./globals.css";

export const metadata: Metadata = {
  title: "Adi Tauqir",
  description: "Personal portfolio",
};

const trispace = Trispace({
  subsets: ["latin"],
  variable: "--font-trispace",
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${trispace.variable} ${sourceCode.variable}`}>
      <body>{children}</body>
    </html>
  );
}
