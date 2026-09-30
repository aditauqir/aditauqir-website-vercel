import localFont from "next/font/local";

export const redaction10 = localFont({
  src: [
    {
      path: "./fonts/Redaction10-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Redaction10-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Redaction10-Italic.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-redaction-10",
  display: "swap",
});

export const aujournuitDensed = localFont({
  src: "./fonts/Aujournuit-Densed.ttf",
  variable: "--font-aujournuit-densed",
  display: "swap",
});

export const generalSans = localFont({
  src: [
    {
      path: "./fonts/GeneralSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const ronzinoRegular = localFont({
  src: [
    {
      path: "./fonts/Ronzino-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Ronzino-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Ronzino-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Ronzino-Oblique.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-ronzino",
  display: "swap",
});
