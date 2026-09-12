export function DocumentMockup() {
  return (
    <svg
      viewBox="0 0 360 440"
      className="h-full w-full"
      role="img"
      aria-labelledby="doc-mockup-title"
    >
      <title id="doc-mockup-title">
        Illustration of a resume with several lines highlighted to match a
        job description
      </title>

      {/* backing sheet, slightly offset to suggest a stack */}
      <rect
        x="34"
        y="26"
        width="292"
        height="392"
        rx="6"
        fill="var(--color-paper)"
        stroke="var(--color-line)"
      />

      {/* main document */}
      <rect
        x="20"
        y="12"
        width="292"
        height="392"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-line)"
      />

      {/* name / header block */}
      <rect x="46" y="42" width="130" height="12" rx="2" fill="var(--color-ink)" />
      <rect x="46" y="62" width="86" height="7" rx="2" fill="var(--color-ink-muted)" />

      {/* divider */}
      <line x1="46" y1="86" x2="286" y2="86" stroke="var(--color-line)" strokeWidth="1.5" />

      {/* section label: summary */}
      <rect x="46" y="102" width="54" height="7" rx="2" fill="var(--color-ink-muted)" />
      <rect x="46" y="118" width="240" height="7" rx="2" fill="var(--color-line)" />
      <rect x="46" y="132" width="210" height="7" rx="2" fill="var(--color-line)" />

      {/* section label: experience */}
      <rect x="46" y="160" width="70" height="7" rx="2" fill="var(--color-ink-muted)" />

      {/* highlighted (matched) line 1 */}
      <rect x="40" y="176" width="246" height="20" rx="4" fill="var(--color-success-tint)" />
      <rect x="46" y="182" width="8" height="8" rx="2" fill="var(--color-success)" />
      <rect x="62" y="183" width="200" height="7" rx="2" fill="var(--color-success-strong)" />

      <rect x="46" y="204" width="230" height="7" rx="2" fill="var(--color-line)" />

      {/* highlighted (matched) line 2 */}
      <rect x="40" y="220" width="246" height="20" rx="4" fill="var(--color-success-tint)" />
      <rect x="46" y="226" width="8" height="8" rx="2" fill="var(--color-success)" />
      <rect x="62" y="227" width="168" height="7" rx="2" fill="var(--color-success-strong)" />

      <rect x="46" y="248" width="214" height="7" rx="2" fill="var(--color-line)" />
      <rect x="46" y="262" width="190" height="7" rx="2" fill="var(--color-line)" />

      {/* section label: skills */}
      <rect x="46" y="290" width="50" height="7" rx="2" fill="var(--color-ink-muted)" />

      {/* skill chips, a couple matched */}
      <rect x="46" y="306" width="58" height="20" rx="10" fill="var(--color-success-tint)" stroke="var(--color-success)" />
      <rect x="110" y="306" width="72" height="20" rx="10" fill="var(--color-paper)" stroke="var(--color-line)" />
      <rect x="188" y="306" width="46" height="20" rx="10" fill="var(--color-success-tint)" stroke="var(--color-success)" />
      <rect x="240" y="306" width="46" height="20" rx="10" fill="var(--color-paper)" stroke="var(--color-line)" />

      {/* section label: education */}
      <rect x="46" y="346" width="64" height="7" rx="2" fill="var(--color-ink-muted)" />
      <rect x="46" y="362" width="180" height="7" rx="2" fill="var(--color-line)" />

      {/* corner match indicator, abstract ring, no numeric claim */}
      <g transform="translate(272,342)">
        <circle r="26" fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="2" />
        <circle
          r="26"
          fill="none"
          stroke="var(--color-success)"
          strokeWidth="4"
          strokeDasharray="123 163"
          strokeLinecap="round"
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}
