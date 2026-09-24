interface StudentPlaceholderProps {
  large?: boolean;
}

export function StudentPlaceholder({
  large = false,
}: StudentPlaceholderProps) {
  return (
    <span
      className={`block shrink-0 rounded-xl border-2 border-[#ff9b24] bg-gradient-to-br from-[#ffd6b4] via-[#f4aec0] to-[#7652c4] ${
        large ? "h-28 w-28" : "h-16 w-16"
      }`}
      aria-label="Student photo placeholder"
    />
  );
}
