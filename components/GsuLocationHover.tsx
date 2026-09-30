"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin } from "lucide-react";
import gsap from "gsap";

const GSU_MAP_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=-84.3935%2C33.7490%2C-84.3795%2C33.7582&layer=mapnik&marker=33.7535835%2C-84.3864639";

const CARD_WIDTH = 280;
const CARD_HEIGHT = 215;

interface GsuLocationHoverProps {
  label?: string;
}

export default function GsuLocationHover({
  label = "GaState, atlanta, GA",
}: GsuLocationHoverProps = {}) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);
  const isTouchRef = useRef(false);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const thumbnail = thumbnailRef.current;
    const trigger = triggerRef.current;
    if (!thumbnail || !trigger) return;

    gsap.set(thumbnail, {
      scale: 0,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center center",
    });

    xToRef.current = gsap.quickTo(thumbnail, "x", {
      duration: 0.4,
      ease: "power3.out",
    });
    yToRef.current = gsap.quickTo(thumbnail, "y", {
      duration: 0.4,
      ease: "power3.out",
    });

    const isMobileOrTouch = () => {
      if (typeof window === "undefined") return false;
      return (
        isTouchRef.current ||
        window.matchMedia("(hover: none), (pointer: coarse)").matches ||
        window.innerWidth < 768
      );
    };

    const updatePosition = (clientX: number, clientY: number) => {
      const halfW = CARD_WIDTH / 2;
      const halfH = CARD_HEIGHT / 2;
      const inset = 16;
      const x = Math.max(
        halfW + inset,
        Math.min(window.innerWidth - halfW - inset, clientX),
      );
      const y = Math.max(
        halfH + inset,
        Math.min(window.innerHeight - halfH - inset, clientY),
      );
      xToRef.current?.(x);
      yToRef.current?.(y);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (isMobileOrTouch()) {
        return;
      }

      setShouldLoadMap(true);
      setIsHovered(true);

      const halfW = CARD_WIDTH / 2;
      const halfH = CARD_HEIGHT / 2;
      const inset = 16;
      const x = Math.max(
        halfW + inset,
        Math.min(window.innerWidth - halfW - inset, e.clientX),
      );
      const y = Math.max(
        halfH + inset,
        Math.min(window.innerHeight - halfH - inset, e.clientY),
      );

      gsap.set(thumbnail, { x, y });
      xToRef.current?.(x);
      yToRef.current?.(y);

      gsap.to(thumbnail, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileOrTouch()) {
        return;
      }
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(thumbnail, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Mobile touch guards
    const handleTouchStart = () => {
      isTouchRef.current = true;
      setIsHovered(false);
      gsap.set(thumbnail, { scale: 0 });
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        isTouchRef.current = true;
        setIsHovered(false);
        gsap.set(thumbnail, { scale: 0 });
      } else {
        isTouchRef.current = false;
      }
    };

    const handleWindowTouch = () => {
      isTouchRef.current = true;
      setIsHovered(false);
      if (thumbnail) {
        gsap.to(thumbnail, {
          scale: 0,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    trigger.addEventListener("mouseenter", handleMouseEnter);
    trigger.addEventListener("mousemove", handleMouseMove);
    trigger.addEventListener("mouseleave", handleMouseLeave);
    trigger.addEventListener("touchstart", handleTouchStart, { passive: true });
    trigger.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("touchstart", handleWindowTouch, { passive: true });
    window.addEventListener("touchend", handleWindowTouch, { passive: true });

    return () => {
      trigger.removeEventListener("mouseenter", handleMouseEnter);
      trigger.removeEventListener("mousemove", handleMouseMove);
      trigger.removeEventListener("mouseleave", handleMouseLeave);
      trigger.removeEventListener("touchstart", handleTouchStart);
      trigger.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("touchstart", handleWindowTouch);
      window.removeEventListener("touchend", handleWindowTouch);
    };
  }, [mounted]);

  const thumbnailElement = (
    <div
      ref={thumbnailRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] hidden select-none overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/5 md:block"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <div className="relative block h-[8.5rem] w-full overflow-hidden bg-[#e8e8e8]">
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
      </div>

      <div className="space-y-1 border-t border-black/10 bg-white px-3 py-2.5">
        <div className="flex items-start gap-1.5 text-[0.78rem] leading-[1.35] font-medium text-black">
          <MapPin
            aria-hidden
            className="mt-[0.15em] size-3 shrink-0"
            strokeWidth={1.8}
          />
          Georgia State University
        </div>
        <div className="pl-[1.15rem] text-[0.7rem] leading-[1.4] text-neutral-600">
          Downtown Atlanta Campus
          <br />
          33 Gilmer St SE, Atlanta, GA 30303
        </div>
      </div>
    </div>
  );

  return (
    <span ref={triggerRef} className="relative inline-flex items-baseline">
      <a
        href="https://www.gsu.edu"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-[0.18em] text-inherit no-underline"
      >
        <span className="underline decoration-black underline-offset-[0.18em]">
          {label}
        </span>
        <MapPin
          aria-hidden
          className={`size-[0.95em] translate-y-[-0.05em] transition-colors duration-150 ease-in-out ${
            isHovered ? "text-black" : "text-muted-foreground"
          }`}
          strokeWidth={1.75}
        />
      </a>

      {mounted ? createPortal(thumbnailElement, document.body) : null}
    </span>
  );
}
