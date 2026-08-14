"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";

export default function SiteLoading() {
  const [value, setValue] = useState(14);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setValue((currentValue) => (currentValue >= 92 ? 18 : currentValue + 9));
    }, 180);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-[18rem]">
        <Progress
          value={value}
          aria-label="Loading progress"
          className="h-[0.35rem] bg-[rgb(235,235,235)]"
        />
      </div>
    </div>
  );
}
