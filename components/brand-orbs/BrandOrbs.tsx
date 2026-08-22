"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { cn } from "@/lib/utils";

import { mountNativeOrb } from "./native-orb";

export const BRAND_ORB_VARIANTS = [
  "claude",
  "openai",
  "codex",
  "cursor",
  "gemini",
  "figma",
  "framer",
  "react",
  "swift",
  "designcode",
  "aura",
  "dreamcut",
  "ui",
  "ux",
  "css",
  "ios",
  "neuform",
  "github",
  "x",
  "instagram",
  "threads",
  "linkedin",
  "email",
] as const;

export const BRAND_ORB_SIZES = ["small", "medium"] as const;

export type BrandOrbVariant = (typeof BRAND_ORB_VARIANTS)[number];
export type BrandOrbSize = (typeof BRAND_ORB_SIZES)[number];
export type BrandOrbMode = "auto" | "dark" | "light";

export type BrandOrbsProps = {
  variant?: BrandOrbVariant;
  size?: BrandOrbSize;
  mode?: BrandOrbMode;
  speed?: number;
  paused?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
};

export const BRAND_ORBS_DEFAULTS = {
  variant: "claude" as BrandOrbVariant,
  size: "medium" as BrandOrbSize,
  mode: "light" as BrandOrbMode,
  speed: 1,
  paused: false,
} as const;

const SIZE_PIXELS: Record<BrandOrbSize, 20 | 56> = {
  small: 20,
  medium: 56,
};

const VARIANT_LABELS: Record<BrandOrbVariant, string> = {
  claude: "Claude Code",
  openai: "OpenAI",
  codex: "Codex",
  cursor: "Cursor",
  gemini: "Gemini",
  figma: "Figma",
  framer: "Framer",
  react: "React",
  swift: "Swift",
  designcode: "DesignCode",
  aura: "Aura",
  dreamcut: "DreamCut",
  ui: "UI",
  ux: "UX",
  css: "CSS",
  ios: "iOS",
  neuform: "Neuform",
  github: "GitHub",
  x: "X",
  instagram: "Instagram",
  threads: "Threads",
  linkedin: "LinkedIn",
  email: "Email",
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function readAutomaticMode(): Exclude<BrandOrbMode, "auto"> {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return "light";
  }
  const declared =
    document.documentElement.dataset.theme ??
    document.documentElement.dataset.scheme;
  if (declared === "light" || declared === "dark") return declared;
  if (document.documentElement.classList.contains("light")) return "light";
  if (document.documentElement.classList.contains("dark")) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useAutomaticMode(enabled: boolean) {
  const [mode, setMode] =
    useState<Exclude<BrandOrbMode, "auto">>(readAutomaticMode);

  useEffect(() => {
    if (!enabled || typeof document === "undefined" || typeof window === "undefined") {
      return undefined;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setMode(readAutomaticMode());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-scheme", "data-theme"],
    });
    media.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, [enabled]);

  return mode;
}

export function BrandOrbs({
  variant = BRAND_ORBS_DEFAULTS.variant,
  size = BRAND_ORBS_DEFAULTS.size,
  mode = BRAND_ORBS_DEFAULTS.mode,
  speed = BRAND_ORBS_DEFAULTS.speed,
  paused = BRAND_ORBS_DEFAULTS.paused,
  href,
  target,
  rel,
  "aria-label": ariaLabel,
  className,
  style,
}: BrandOrbsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  const [hostVisible, setHostVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const automaticMode = useAutomaticMode(mode === "auto");
  const resolvedMode = mode === "auto" ? automaticMode : mode;
  const safeVariant = BRAND_ORB_VARIANTS.includes(variant)
    ? variant
    : BRAND_ORBS_DEFAULTS.variant;
  const safeSize = BRAND_ORB_SIZES.includes(size) ? size : BRAND_ORBS_DEFAULTS.size;
  const safeSpeed = clamp(speed, 0.1, 3);
  const effectivePaused = paused || !hostVisible || !documentVisible;
  const pixels = SIZE_PIXELS[safeSize];
  const label = ariaLabel ?? `${VARIANT_LABELS[safeVariant]} animated brand orb`;

  useEffect(() => {
    pausedRef.current = effectivePaused;
    speedRef.current = safeSpeed;
  }, [effectivePaused, safeSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    return mountNativeOrb(canvas, {
      variant: safeVariant,
      size: pixels,
      light: resolvedMode === "light",
      getPaused: () => pausedRef.current,
      getSpeed: () => speedRef.current,
    });
  }, [pixels, resolvedMode, safeVariant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) =>
      setHostVisible(entry?.isIntersecting ?? true),
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const orb = (
    <canvas
      ref={canvasRef}
      width={pixels}
      height={pixels}
      aria-hidden="true"
      className="block bg-transparent"
      style={{ width: pixels, height: pixels }}
    />
  );

  const frameStyle: CSSProperties = {
    width: pixels,
    height: pixels,
    ...style,
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel ?? VARIANT_LABELS[safeVariant]}
        className={cn(
          "inline-flex items-center justify-center overflow-visible rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-black",
          className,
        )}
        style={frameStyle}
      >
        {orb}
      </a>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center justify-center overflow-visible", className)}
      style={frameStyle}
      role="img"
      aria-label={label}
    >
      {orb}
    </span>
  );
}
