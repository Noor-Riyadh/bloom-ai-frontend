import Image from "next/image";

interface StudentPlaceholderProps {
  large?: boolean;
  name?: string;
  variant?: "compact" | "default" | "medium";
}

export function StudentPlaceholder({
  large = false,
  name,
  variant = "default",
}: StudentPlaceholderProps) {
  const profileImage =
    name === "Ahmed Ali"
      ? "/icons/profile1.png"
      : name === "Jana Ahmed"
        ? "/icons/profile2.png"
        : name === "Omar Mohamed"
          ? "/icons/profile3.png"
          : name === "Youssef Hassan"
            ? "/icons/profile4.png"
            : null;
  const size = large ? 112 : variant === "medium" ? 80 : variant === "compact" ? 48 : 64;
  const dimensions = large
    ? "h-28 w-28"
    : variant === "medium"
      ? "h-20 w-20"
      : variant === "compact"
        ? "h-12 w-12"
        : "h-16 w-16";

  if (profileImage) {
    return (
      <Image
        src={profileImage}
        alt={`${name} profile photo`}
        width={size}
        height={size}
        className={`block shrink-0 rounded-xl border-2 border-[#ff9b24] object-cover ${dimensions}`}
      />
    );
  }

  return (
    <span
      className={`block shrink-0 rounded-xl border-2 border-[#ff9b24] bg-gradient-to-br from-[#ffd6b4] via-[#f4aec0] to-[#7652c4] ${dimensions}`}
      aria-label={name ? `${name} profile photo` : "Student photo placeholder"}
    />
  );
}
