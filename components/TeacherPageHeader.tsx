interface TeacherPageHeaderProps {
  title: string;
  name?: string;
  compact?: boolean;
}

export function TeacherPageHeader({
  title,
  name,
  compact = false,
}: TeacherPageHeaderProps) {
  return (
    <header className="flex items-center gap-0">
      <div
      />
      <div className="text-left">
        <div className={`h-2 w-24 bg-[#b20cf0] ${compact ? "mb-4" : "mb-6"}`} />
        <h1
          className={`font-extrabold leading-none text-[#a20bed] ${
            compact
              ? "text-5xl tracking-[-2px]"
              : "text-6xl tracking-[-3px]"
          }`}
        >
          {title}
        </h1>
        {name && (
          <p
            className={`mt-2 font-extrabold leading-none text-[#080808] ${
              compact
                ? "text-4xl tracking-[-2px]"
                : "text-5xl tracking-[-2.5px]"
            }`}
          >
            {name}
          </p>
        )}
      </div>
    </header>
  );
}
