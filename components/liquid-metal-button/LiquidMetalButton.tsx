"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import { LIQUID_METAL_BUTTON_HTML } from "./source";

export type LiquidMetalButtonVariant = "pill" | "circle" | "play";

export type LiquidMetalButtonProps = {
  variant?: LiquidMetalButtonVariant;
  className?: string;
  rendering?: "colored" | "monotone";
  diameter?: number;
  strokeWidth?: number;
  height?: number;
  text?: string;
  href?: string;
  target?: string;
  rel?: string;
  showIcon?: boolean;
  embedded?: boolean;
  onClick?: () => void;
};

const LIQUID_METAL_BUTTON_BRIDGE = `
<script id="liquid-metal-button-bridge">
  window.addEventListener('message', event => {
    if(event.source !== parent) return;
    const config = event.data && event.data.liquidMetalButton;
    if(!config) return;
    const text = typeof config.text === 'string' ? config.text.slice(0, 24) : '';
    const label = btn.querySelector('.lbl');
    if(label) label.textContent = text;
    btn.setAttribute('aria-label', text || 'Button');
    if(Number.isFinite(config.pillWidthUnits)) {
      stage.style.setProperty('--bw', 'calc(' + config.pillWidthUnits + ' * var(--u))');
    }
    if(Number.isFinite(config.heightPx)) {
      stage.style.setProperty('--h', config.heightPx + 'px');
    }
    if(Number.isFinite(config.padUnits)) {
      stage.style.setProperty('--pad', 'calc(' + config.padUnits + ' * var(--u))');
    }
    const icon = btn.querySelector('.ico');
    if(icon) icon.style.display = config.showIcon === false ? 'none' : '';
    document.body.style.background = 'transparent';
    document.documentElement.style.background = 'transparent';
    stage.style.position = 'absolute';
    stage.style.top = '50%';
    stage.style.left = '50%';
    stage.style.transform = 'translate(-50%, -50%)';
  });

  btn.addEventListener('click', () => {
    parent.postMessage({ liquidMetalButton: { type: 'activate' } }, '*');
  });
</script>`;

const EMBED_STYLE = `
<style id="liquid-metal-embed">
  html, body {
    background: transparent !important;
  }
  body {
    background: none !important;
    font-family: "Trispace", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  .btn {
    font-variation-settings: "wdth" 95.1, "wght" 500;
    letter-spacing: -0.05em;
  }
</style>`;

const CIRCLE_RUNTIME_STYLE = `
<style id="liquid-metal-circle-variant">
  body[data-shape="circle"] .stage {
    --h: clamp(56px, 10vmin, 72px);
    --bw: var(--h);
  }

  body[data-shape="circle"] .btn {
    gap: 0;
  }

  body[data-shape="circle"] .btn .ico {
    width: 28%;
    height: 28%;
  }

  body[data-shape="circle"] .btn .lbl {
    display: none;
  }
</style>`;

function withTransparentPage(source: string) {
  return source
    .replace(
      'href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap"',
      'href="https://fonts.googleapis.com/css2?family=Trispace:wdth,wght@75..125,100..800&display=swap"',
    )
    .replace(
      'font-family:"Inter",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;',
      'font-family:"Trispace",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;',
    )
    .replace(
      /background:\s*radial-gradient\(46vmax 32vmax at 50% 47%,\s*#191b21 0%, #0e0f13 34%, #050506 62%, #000 88%\) #000;/,
      "background: transparent;",
    );
}

function sourceForVariant(variant: Exclude<LiquidMetalButtonVariant, "play">) {
  const html = withTransparentPage(LIQUID_METAL_BUTTON_HTML).replace(
    "</head>",
    `${EMBED_STYLE}\n</head>`,
  );

  if (variant === "pill") {
    return html.replace("</body>", `${LIQUID_METAL_BUTTON_BRIDGE}\n</body>`);
  }

  return html
    .replace("</head>", `${CIRCLE_RUNTIME_STYLE}\n</head>`)
    .replace("<body>", '<body data-shape="circle">')
    .replace(
      '<button class="btn" id="btn" type="button">',
      '<button class="btn" id="btn" type="button" aria-label="Add">',
    )
    .replace("</body>", `${LIQUID_METAL_BUTTON_BRIDGE}\n</body>`);
}

function clamp(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

const REFERENCE_HEIGHT = 516;
const DEFAULT_PILL_HEIGHT = 40;
const DEFAULT_PAD_UNITS = 160;

export function LiquidMetalButton({
  className = "",
  variant = "pill",
  height = DEFAULT_PILL_HEIGHT,
  text,
  href,
  target = "_blank",
  showIcon = true,
  embedded = true,
  onClick,
}: LiquidMetalButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const intersectsRef = useRef(true);
  const [mounted, setMounted] = useState(true);
  const [ready, setReady] = useState(false);
  const safeVariant: LiquidMetalButtonVariant =
    variant === "circle" || variant === "play" ? variant : "pill";
  const isPlayButton = safeVariant === "play";
  const safeText = String(
    text ??
      (safeVariant === "pill"
        ? "Sign up"
        : safeVariant === "circle"
          ? "Add"
          : "Play"),
  ).slice(0, 24);
  const pillWidthUnits =
    safeVariant === "pill"
      ? Math.min(
          3000,
          Math.max(
            1407,
            (showIcon ? 820 : 520) + safeText.length * 94,
          ),
        )
      : undefined;
  const safeHeight = clamp(height, 28, 88, DEFAULT_PILL_HEIGHT);
  const source = useMemo(
    () => sourceForVariant(safeVariant === "play" ? "pill" : safeVariant),
    [safeVariant],
  );

  const unit = safeHeight / REFERENCE_HEIGHT;
  const padPx = DEFAULT_PAD_UNITS * unit;
  const buttonWidth =
    safeVariant === "pill" && pillWidthUnits
      ? pillWidthUnits * unit
      : safeHeight;
  const hostWidth = Math.ceil(buttonWidth + padPx * 2);
  const hostHeight = Math.ceil(safeHeight + padPx * 2);

  const syncButtonConfig = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      {
        liquidMetalButton: {
          text: safeText,
          pillWidthUnits,
          heightPx: safeHeight,
          padUnits: DEFAULT_PAD_UNITS,
          showIcon,
          embedded,
        },
      },
      "*",
    );
  }, [embedded, pillWidthUnits, safeHeight, safeText, showIcon]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const sync = () => {
      const nextMounted =
        intersectsRef.current && document.visibilityState !== "hidden";
      setMounted(nextMounted);
      if (!nextMounted) setReady(false);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersectsRef.current = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );

    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    syncButtonConfig();
  }, [ready, syncButtonConfig]);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.liquidMetalButton?.type !== "activate") return;
      onClick?.();
      if (!href) return;
      if (target === "_blank") {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      window.location.assign(href);
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [href, onClick, target]);

  const title =
    safeVariant === "circle"
      ? "Interactive liquid metal circle button"
      : isPlayButton
        ? "Interactive liquid metal play button"
        : `${safeText} liquid metal button`;

  return (
    <div
      ref={hostRef}
      className={cn("liquid-metal-button", className)}
      data-state={!mounted ? "paused" : ready ? "ready" : "loading"}
      data-variant={safeVariant}
      style={{ width: hostWidth, height: hostHeight }}
    >
      {mounted ? (
        <iframe
          key={safeVariant}
          ref={frameRef}
          className={cn(
            "liquid-metal-button__frame",
            ready && "is-ready",
          )}
          title={title}
          srcDoc={source}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => {
            setReady(true);
            syncButtonConfig();
          }}
        />
      ) : null}
    </div>
  );
}
