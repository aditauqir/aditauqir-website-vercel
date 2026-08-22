"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export type DiagnosticsPanelVariant = "nodes";

export type DiagnosticsPanelProps = {
  variant?: DiagnosticsPanelVariant;
  className?: string;
  "aria-label"?: string;
};

type Point = { x: number; y: number };

function projectIso(x: number, y: number, z: number): Point {
  const angle = Math.PI / 6;
  return {
    x: (x - z) * Math.cos(angle),
    y: y + (x + z) * Math.sin(angle),
  };
}

function drawCube(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  z: number,
  s: number,
  colorStr: string,
) {
  const pts = [
    projectIso(x - s, y - s, z - s),
    projectIso(x + s, y - s, z - s),
    projectIso(x + s, y - s, z + s),
    projectIso(x - s, y - s, z + s),
    projectIso(x - s, y + s, z - s),
    projectIso(x + s, y + s, z - s),
    projectIso(x + s, y + s, z + s),
    projectIso(x - s, y + s, z + s),
  ];
  ctx.strokeStyle = colorStr;
  ctx.lineWidth = 2.25;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.lineTo(pts[1].x, pts[1].y);
  ctx.lineTo(pts[2].x, pts[2].y);
  ctx.lineTo(pts[3].x, pts[3].y);
  ctx.closePath();
  ctx.moveTo(pts[4].x, pts[4].y);
  ctx.lineTo(pts[5].x, pts[5].y);
  ctx.lineTo(pts[6].x, pts[6].y);
  ctx.lineTo(pts[7].x, pts[7].y);
  ctx.closePath();
  ctx.moveTo(pts[0].x, pts[0].y);
  ctx.lineTo(pts[4].x, pts[4].y);
  ctx.moveTo(pts[1].x, pts[1].y);
  ctx.lineTo(pts[5].x, pts[5].y);
  ctx.moveTo(pts[2].x, pts[2].y);
  ctx.lineTo(pts[6].x, pts[6].y);
  ctx.moveTo(pts[3].x, pts[3].y);
  ctx.lineTo(pts[7].x, pts[7].y);
  ctx.stroke();
}

function drawNodes(ctx: CanvasRenderingContext2D, t: number) {
  const s = 22;
  const float = Math.sin(t) * 4;
  drawCube(ctx, -35, -float, -35, s, "rgba(0,0,0,0.55)");
  drawCube(ctx, 35, float, -35, s, "rgba(0,0,0,0.55)");
  drawCube(ctx, -35, float, 35, s, "rgba(0,0,0,0.55)");
  drawCube(ctx, 35, -float, 35, s, "rgba(0,0,0,0.55)");
  drawCube(ctx, 0, Math.cos(t) * 6 - 15, 0, s * 0.9, "#000000");
}

export function DiagnosticsPanel({
  variant = "nodes",
  className,
  "aria-label": ariaLabel,
}: DiagnosticsPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || variant !== "nodes") return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const parent = canvas.parentElement;
    let width = 0;
    let height = 0;
    let time = 0.8;
    let frameId = 0;
    let running = true;

    const resize = () => {
      const rect = (parent ?? canvas).getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const scale = Math.min(width, height) / 220;
      ctx.translate(width / 2, height / 2 + 5 * scale);
      ctx.scale(scale, scale);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      drawNodes(ctx, time);
      ctx.restore();
    };

    const loop = () => {
      if (!running) return;
      if (document.visibilityState !== "hidden") {
        time += 0.015;
        paint();
      }
      frameId = window.requestAnimationFrame(loop);
    };

    resize();
    paint();
    if (!reducedMotion) {
      frameId = window.requestAnimationFrame(loop);
    }

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(resize);
    observer?.observe(parent ?? canvas);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block size-full bg-transparent", className)}
      aria-label={ariaLabel ?? "Loading"}
      role="img"
    />
  );
}
