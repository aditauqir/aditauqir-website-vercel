"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const dissolve = {
  duration: 0.35,
  ease: "easeInOut" as const,
};

export default function AdiNoorHover() {
  const [hovered, setHovered] = useState(false);
  const adiRef = useRef<HTMLSpanElement>(null);
  const noorRef = useRef<HTMLSpanElement>(null);
  const [adiWidth, setAdiWidth] = useState(0);
  const [noorWidth, setNoorWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const adi = adiRef.current;
      const noor = noorRef.current;

      if (!adi || !noor) {
        return;
      }

      setAdiWidth(adi.offsetWidth);
      setNoorWidth(noor.offsetWidth);
    };

    measure();

    const observer = new ResizeObserver(measure);

    if (adiRef.current) {
      observer.observe(adiRef.current);
    }

    if (noorRef.current) {
      observer.observe(noorRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const width = hovered ? noorWidth : adiWidth;
  const measured = adiWidth > 0 && noorWidth > 0;

  return (
    <span
      className="relative z-10 inline-flex overflow-visible px-1 align-baseline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="relative inline-block overflow-visible whitespace-nowrap"
        initial={false}
        animate={measured ? { width } : undefined}
        transition={dissolve}
      >
        <span
          ref={adiRef}
          className="invisible whitespace-nowrap"
          aria-hidden
        >
          Adi
        </span>
        <span
          ref={noorRef}
          className="invisible absolute top-0 left-0 whitespace-nowrap"
          aria-hidden
        >
          Noor
        </span>
        <motion.span
          className="absolute top-0 left-0 whitespace-nowrap"
          initial={false}
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={dissolve}
        >
          Adi
        </motion.span>
        <motion.span
          className="absolute top-0 left-0 whitespace-nowrap"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={dissolve}
          aria-hidden
        >
          Noor
        </motion.span>
      </motion.span>
    </span>
  );
}
