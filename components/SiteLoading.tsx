export function PageLoadingSpinner({
  className = "size-8 text-neutral-900",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path strokeDasharray={18} d="M12 3c4.97 0 9 4.03 9 9">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.3s"
            values="18;0"
          />
          <animateTransform
            attributeName="transform"
            dur="1.5s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
        <path
          strokeDasharray={60}
          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
          opacity=".3"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="1.2s"
            values="60;0"
          />
        </path>
      </g>
    </svg>
  );
}

export default function SiteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex min-h-screen w-full items-center justify-center bg-transparent"
    >
      <PageLoadingSpinner className="size-9 text-neutral-900" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
