import type { Metadata } from "next";
import { Source_Code_Pro } from "next/font/google";

import { generalSans, redaction10 } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adi Tauqir",
  description: "Personal portfolio",
};

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
    <html
      lang="en"
      className={`${generalSans.variable} ${sourceCode.variable} ${redaction10.variable}`}
    >
      <body className={generalSans.className}>{children}</body>
    </html>
  );
}
