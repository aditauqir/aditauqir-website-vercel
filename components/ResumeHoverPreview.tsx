"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

const CARD_WIDTH = 214;
const CARD_HEIGHT = 277;

export default function ResumeHoverPreview() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);
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
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      gsap.to(thumbnail, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    trigger.addEventListener("mouseenter", handleMouseEnter);
    trigger.addEventListener("mousemove", handleMouseMove);
    trigger.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      trigger.removeEventListener("mouseenter", handleMouseEnter);
      trigger.removeEventListener("mousemove", handleMouseMove);
      trigger.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mounted]);

  const thumbnailElement = (
    <div
      ref={thumbnailRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] select-none overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/5"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/resume-preview.png"
        alt="Resume preview"
        className="pointer-events-none h-full w-full select-none object-cover object-top"
      />
    </div>
  );

  return (
    <div ref={triggerRef} className="relative z-30 inline-block">
      <Button
        asChild
        className="h-auto w-fit rounded-full bg-black/90 px-3 py-1.5 text-[0.86rem] font-medium !text-white shadow-sm backdrop-blur-sm transition-transform duration-150 hover:bg-black hover:!text-white active:scale-95 lg:text-[0.81rem]"
      >
        <a href="/resume.pdf" download>
          resume
        </a>
      </Button>

      {mounted ? createPortal(thumbnailElement, document.body) : null}
    </div>
  );
}
