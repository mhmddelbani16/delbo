export function DelboMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      role="img"
      aria-label="Delbo"
    >
      {/* left alignment bracket */}
      <path
        d="M22 8 L6 24 L22 40"
        stroke="var(--color-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* precision match bar */}
      <rect
        x="21.5"
        y="14"
        width="5"
        height="20"
        rx="2.5"
        fill="var(--color-success)"
      />
      {/* right alignment bracket */}
      <path
        d="M26 8 L42 24 L26 40"
        stroke="var(--color-success)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DelboWordmark({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <DelboMark className="h-7 w-7" />
      <span
        className={`font-display text-xl font-bold tracking-tight ${
          tone === "dark" ? "text-paper" : "text-ink"
        }`}
      >
        Delbo
      </span>
    </span>
  );
}
