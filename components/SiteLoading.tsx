"use client";

import { DiagnosticsPanel } from "@/components/diagnostics-panel/DiagnosticsPanel";

export default function SiteLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background px-6"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-[min(72vmin,22rem)] w-[min(72vmin,22rem)] min-h-[12rem] min-w-[12rem]">
        <DiagnosticsPanel variant="nodes" aria-label="Loading" />
      </div>
    </div>
  );
}
