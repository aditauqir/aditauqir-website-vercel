"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin } from "lucide-react";

const GSU_MAP_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=-84.3935%2C33.7490%2C-84.3795%2C33.7582&layer=mapnik&marker=33.7535835%2C-84.3864639";

const GSU_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Georgia+State+University+Atlanta";

export default function GsuLocationHover() {
  const [open, setOpen] = useState(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<number | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setCoords({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  };

  const show = () => {
    clearHideTimer();
    updatePosition();
    setShouldLoadMap(true);
    setOpen(true);
  };

  const hide = () => {
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => {
      setOpen(false);
    }, 80);
  };

  useEffect(() => {
    return () => {
      clearHideTimer();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  return (
    <span
      ref={triggerRef}
      className="inline-flex items-baseline"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span className="inline-flex items-center gap-[0.18em]">
        georgia state
        <MapPin
          aria-hidden
          className={`size-[0.95em] translate-y-[-0.05em] transition-colors duration-200 ease-in-out ${
            open ? "text-black" : "text-muted-foreground"
          }`}
          strokeWidth={1.75}
        />
      </span>

      {open
        ? createPortal(
            <div
              role="tooltip"
              aria-label="Georgia State University location"
              onMouseEnter={show}
              onMouseLeave={hide}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
              }}
              className="w-[min(17.5rem,calc(100vw-2.5rem))] origin-top -translate-x-1/2 animate-[gsu-card-in_200ms_ease-in-out]"
            >
              <div className="overflow-hidden rounded-xl border border-black/15 bg-white">
                <div className="h-[8.5rem] w-full overflow-hidden bg-[#e8e8e8]">
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
                </div>

                <div className="space-y-1 border-t border-black/10 px-3 py-2.5">
                  <p className="flex items-start gap-1.5 text-[0.78rem] leading-[1.35] font-medium tracking-[-0.05em] text-black">
                    <MapPin
                      aria-hidden
                      className="mt-[0.15em] size-3 shrink-0"
                      strokeWidth={1.8}
                    />
                    Georgia State University
                  </p>
                  <p className="pl-[1.15rem] text-[0.7rem] leading-[1.4] tracking-[-0.04em] text-muted-foreground">
                    Downtown Atlanta Campus
                    <br />
                    33 Gilmer St SE, Atlanta, GA 30303
                  </p>
                  <a
                    href={GSU_GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block pl-[1.15rem] pt-1 text-[0.68rem] tracking-[-0.04em] text-black underline underline-offset-2"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
