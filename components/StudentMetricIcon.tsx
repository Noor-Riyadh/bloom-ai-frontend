export type StudentMetricIconType = "score" | "attendance" | "study";

export function StudentMetricIcon({ type }: { type: StudentMetricIconType }) {
  if (type === "score") {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M8 54V12m0 42h48M15 43l12-12 8 7 17-21" />
        <path d="M43 16h9v9M18 48v-7m12 7V34m12 14V27m12 21V20" />
      </svg>
    );
  }

  if (type === "attendance") {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <rect x="9" y="13" width="46" height="42" rx="4" />
        <path d="M18 8v10m28-10v10M9 24h46M18 32h3m9 0h3m9 0h3M18 41h3m9 0h3m9 0h3M18 50h3m9 0h3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M10 52h44M15 52V18h18v34M33 52V10h16v42" />
      <path d="M20 25h7m-7 8h7m-7 8h7m19-17h-7m7 8h-7m7 8h-7" />
    </svg>
  );
}
