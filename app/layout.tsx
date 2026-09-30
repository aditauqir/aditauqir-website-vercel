import type { Metadata, Viewport } from "next";
import { Source_Code_Pro } from "next/font/google";

import { generalSans, redaction10 } from "./fonts";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#cfbfc5" },
    { media: "(prefers-color-scheme: dark)", color: "#cfbfc5" },
  ],
};

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
