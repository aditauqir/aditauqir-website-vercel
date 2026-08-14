"use client";

import { useRef, useState } from "react";
import { MapPin } from "lucide-react";

const GSU_MAP_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=-84.3935%2C33.7490%2C-84.3795%2C33.7582&layer=mapnik&marker=33.7535835%2C-84.3864639";

const GSU_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Georgia+State+University+Atlanta";

export default function GsuLocationHover() {
  const [open, setOpen] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const show = () => {
    clearHideTimer();
    setShouldLoadMap(true);
    setOpen(true);
  };

  const hide = () => {
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => {
      setOpen(false);
    }, 40);
  };

  return (
    <span
      className="relative z-[100] inline-flex items-baseline"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <a
        href="https://www.gsu.edu"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-[0.18em] text-inherit no-underline"
      >
        <span className="underline decoration-black underline-offset-[0.18em]">
          GaState, atlanta, GA
        </span>
        <MapPin
          aria-hidden
          className={`size-[0.95em] translate-y-[-0.05em] transition-colors duration-150 ease-in-out ${
            open ? "text-black" : "text-muted-foreground"
          }`}
          strokeWidth={1.75}
        />
      </a>

      <span
        role="tooltip"
        aria-hidden={!open}
        aria-label="Georgia State University location"
        className="absolute top-full z-[100] w-[min(17.5rem,calc(100vw-2.5rem))] pt-2"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <span
          className="block overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.10)]"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(8px)",
            pointerEvents: open ? "auto" : "none",
            transition:
              "opacity 180ms ease-in-out, transform 180ms ease-in-out",
          }}
        >
          <span className="relative block h-[8.5rem] w-full overflow-hidden bg-[#e8e8e8]">
            {shouldLoadMap ? (
              <iframe
                title="Georgia State University map"
                src={GSU_MAP_EMBED}
                className="pointer-events-none absolute -top-1 -left-11 h-[calc(100%+3rem)] w-[calc(100%+2.75rem)] max-w-none border-0 grayscale-[0.15]"
                loading="lazy"
                tabIndex={-1}
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : null}
          </span>

          <span className="block space-y-1 border-t border-black/10 px-3 py-2.5">
            <span className="flex items-start gap-1.5 text-[0.78rem] leading-[1.35] font-medium tracking-[-0.05em] text-black">
              <MapPin
                aria-hidden
                className="mt-[0.15em] size-3 shrink-0"
                strokeWidth={1.8}
              />
              Georgia State University
            </span>
            <span className="block pl-[1.15rem] text-[0.7rem] leading-[1.4] tracking-[-0.04em] text-muted-foreground">
              Downtown Atlanta Campus
              <br />
              33 Gilmer St SE, Atlanta, GA 30303
            </span>
            <a
              href={GSU_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block pl-[1.15rem] pt-1 text-[0.68rem] tracking-[-0.04em] text-black underline underline-offset-2"
            >
              Open in Google Maps
            </a>
          </span>
        </span>
      </span>
    </span>
  );
}
