"use client";

import { useEffect, useState } from "react";

function formatAtlantaTime() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date());
}

export default function HomeClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(formatAtlantaTime());
    };

    updateTime();

    const intervalId = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <p
      className="font-mono text-[0.87rem] font-normal text-neutral-700 uppercase lg:text-[0.78rem] tracking-wider"
      suppressHydrationWarning
    >
      {time || "Atlanta time"}
    </p>
  );
}
