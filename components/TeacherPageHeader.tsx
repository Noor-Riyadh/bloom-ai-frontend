interface TeacherPageHeaderProps {
  title: string;
  name?: string;
}

export function TeacherPageHeader({ title, name }: TeacherPageHeaderProps) {
  return (
    <header className="flex items-center gap-24">
      <div className="h-[210px] w-[210px] rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(135deg,#ff851b,#d13be8)_border-box]" />
      <div>
        <div className="mb-6 h-2 w-24 bg-[#b20cf0]" />
        <h1 className="text-6xl font-extrabold leading-none tracking-[-3px] text-[#a20bed]">
          {title}
        </h1>
        {name && (
          <p className="mt-2 text-5xl font-extrabold leading-none tracking-[-2.5px] text-[#080808]">
            {name}
          </p>
        )}
      </div>
    </header>
  );
}
