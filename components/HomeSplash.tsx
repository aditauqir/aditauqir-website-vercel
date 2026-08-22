"use client";

import { useEffect, useState } from "react";

import SiteLoading from "@/components/SiteLoading";

const SPLASH_MS = 2200;
const FADE_MS = 420;

export default function HomeSplash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hold = reduced ? 900 : SPLASH_MS;
    const fadeTimer = window.setTimeout(() => setFading(true), hold);
    const hideTimer = window.setTimeout(
      () => setVisible(false),
      hold + FADE_MS,
    );
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[300] bg-background transition-opacity duration-[420ms] ease-out"
      style={{ opacity: fading ? 0 : 1 }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <SiteLoading />
    </div>
  );
}
