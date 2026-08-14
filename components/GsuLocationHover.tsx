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
        className="inline-flex items-center gap-[0.18em] text-inherit underline decoration-black/50 underline-offset-[0.18em]"
      >
        GaState, atlanta, GA
        <MapPin
          aria-hidden
          className={`size-[0.95em] translate-y-[-0.05em] transition-colors duration-100 ease-out ${
            open ? "text-black" : "text-muted-foreground"
          }`}
          strokeWidth={1.75}
        />
      </a>

      {open ? (
        <span
          role="tooltip"
          aria-label="Georgia State University location"
          className="absolute top-full left-1/2 z-[100] w-[min(17.5rem,calc(100vw-2.5rem))] -translate-x-1/2 pt-2"
        >
          <span className="block animate-[gsu-card-in_80ms_ease-out] overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.10)]">
            <span className="block h-[8.5rem] w-full overflow-hidden bg-[#e8e8e8]">
              {shouldLoadMap ? (
                <iframe
                  title="Georgia State University map"
                  src={GSU_MAP_EMBED}
                  className="pointer-events-none h-[calc(100%+2rem)] w-full border-0 grayscale-[0.15]"
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
      ) : null}
    </span>
  );
}
