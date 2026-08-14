"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const GSU_MAP_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=-84.3935%2C33.7490%2C-84.3795%2C33.7582&layer=mapnik&marker=33.7535835%2C-84.3864639";

const GSU_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Georgia+State+University+Atlanta";

export default function GsuLocationHover() {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  return (
    <span
      className="group relative z-50 inline-flex items-baseline"
      onMouseEnter={() => setShouldLoadMap(true)}
    >
      <span className="inline-flex cursor-default items-center gap-[0.18em]">
        georgia state
        <MapPin
          aria-hidden
          className="size-[0.9em] translate-y-[-0.06em] text-muted-foreground transition-colors duration-200 ease-in-out group-hover:text-black"
          strokeWidth={1.75}
        />
      </span>

      <span
        role="tooltip"
        className="pointer-events-none invisible absolute top-[calc(100%+0.45rem)] left-1/2 z-[60] w-[min(17.5rem,calc(100vw-2.5rem))] origin-top -translate-x-1/2 translate-y-1.5 scale-[0.98] overflow-hidden rounded-xl border border-black/15 bg-background opacity-0 transition-all duration-200 ease-in-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
      >
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
  );
}
