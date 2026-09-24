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
    <header className="flex items-center gap-24">
      <div
        className={`rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(135deg,#ff851b,#d13be8)_border-box] ${
          compact ? "h-40 w-40" : "h-[210px] w-[210px]"
        }`}
      />
      <div>
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
