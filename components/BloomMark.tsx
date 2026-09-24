interface BloomMarkProps {
  compact?: boolean;
  showText?: boolean;
}

export function BloomMark({
  compact = false,
  showText = compact,
}: BloomMarkProps) {
  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <svg
        aria-label="Bloom"
        className={compact ? "h-8 w-8" : "h-[106px] w-[106px]"}
        viewBox="0 0 106 106"
        role="img"
      >
        <rect width="106" height="106" rx="20" fill="#151515" />
        <circle cx="53" cy="32" r="12" fill="#b5f51c" />
        <path
          d="M19 42c25 2 39 16 39 43-24-1-39-15-39-43Z"
          fill="#ff851b"
        />
        <path
          d="M87 42C62 44 48 58 48 85c24-1 39-15 39-43Z"
          fill="#7539ee"
        />
      </svg>
      {showText && (
        <span className="text-base font-extrabold tracking-[-0.6px] text-white">
          BLOOM
        </span>
      )}
    </div>
  );
}
