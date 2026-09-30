"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 2.5,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
    href?: string;
    target?: string;
    rel?: string;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative isolate inline-flex h-min w-fit items-center justify-center overflow-hidden rounded-full border border-black/25 bg-background p-[1.5px] no-underline transition-all duration-300 hover:border-black/50 hover:shadow-[0_0_12px_rgba(0,0,0,0.08)]",
        containerClassName,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden rounded-full">
        <motion.div
          aria-hidden="true"
          className="absolute -inset-[150%]"
          animate={{ rotate: clockwise ? 360 : -360 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: hovered ? Math.max(duration * 0.6, 1.2) : duration,
          }}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(0, 0, 0, 0.15) 290deg, rgba(0, 0, 0, 0.95) 335deg, rgba(0, 0, 0, 0.15) 355deg, transparent 360deg)",
          }}
        />
      </div>

      <div
        className={cn(
          "relative z-10 w-auto rounded-full bg-background px-3 py-1.5 text-foreground transition-colors duration-200",
          className,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

