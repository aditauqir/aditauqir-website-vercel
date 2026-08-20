"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
}: {
  children: React.ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const markReady = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setReady(true);
      }
    };

    markReady();

    const resizeObserver = new ResizeObserver(() => {
      markReady();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, []);

  return (
    <div
      className={cn("relative w-fit overflow-visible", containerClassName)}
      ref={containerRef}
    >
      {children}
      {ready && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 overflow-visible"
          initial={{ opacity: 0, scale: 0.95, originX: 0, originY: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className={cn(
              "absolute top-0 left-0 h-full w-full border border-neutral-800 dark:border-neutral-200",
              rectangleClassName,
            )}
            initial={{
              width: 0,
              height: 0,
            }}
            animate={{
              width: "100%",
              height: "100%",
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="pointer-events-none absolute top-full left-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              x: 4,
              y: 4,
              rotate: -90,
            }}
            transition={{
              opacity: { duration: 0.1, ease: "easeInOut" },
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <Pointer
              className={cn("h-5 w-5 text-blue-500", pointerClassName)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

const Pointer = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
    </svg>
  );
};
