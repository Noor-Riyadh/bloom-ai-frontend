import Image from "next/image";
import type { AdminStudent, Student } from "@/lib/mockData";

type MetricIcon = "students" | "score" | "risk" | "attendance";

function MetricIcon({ type }: { type: MetricIcon }) {
  if (type === "students") {
    return (
      <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
        <path d="M13 55c1-12 9-18 19-18s18 6 19 18H13Z" />
        <circle cx="32" cy="25" r="9" />
        <path d="m17 9 15-5 15 5-15 5-15-5Z" />
      </svg>
    );
  }
  if (type === "score") {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="M8 54V12m0 42h48M15 43l12-12 8 7 17-21" />
        <path d="M43 16h9v9" />
        <path d="M18 48v-7m12 7V34m12 14V27m12 21V20" />
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
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
      <path d="m32 7 25 45H7L32 7Z" />
      <path d="M32 23v13m0 7v3" />
    </svg>
  );
}

export function TeacherMetricCards({
  students,
  compact = false,
  useImageIcons = false,
}: {
  students: Array<Student | AdminStudent>;
  compact?: boolean;
  useImageIcons?: boolean;
}) {
  const average = (values: number[]) =>
    values.length === 0
      ? 0
      : values.reduce((total, value) => total + value, 0) / values.length;
  const scores = students.flatMap((student) =>
    student.overall_score == null ? [] : [student.overall_score],
  );
  const attendance = students.flatMap((student) =>
    student.attendance_percentage == null
      ? []
      : [student.attendance_percentage],
  );
  const metrics: Array<{
    label: string;
    value: string;
    icon: MetricIcon;
  }> = [
    { label: "My Students", value: String(students.length), icon: "students" },
    { label: "Average Score", value: average(scores).toFixed(1), icon: "score" },
    {
      label: "At Risk",
      value: String(
        students.filter((student) => student.performance_level === "At Risk").length,
      ),
      icon: "risk",
    },
    {
      label: "Average Attendance",
      value: `${average(attendance).toFixed(1)}%`,
      icon: "attendance",
    },
  ];

  return (
    <div className={`grid grid-cols-4 ${compact ? "gap-8" : "gap-10"}`}>
      {metrics.map((metric) => (
        <div className="text-center" key={metric.label}>
          <div
            className={`mx-auto flex items-center justify-center rounded-xl bg-gradient-to-br from-[#a900f5] to-[#a400e8] text-white shadow-[2px_4px_5px_rgba(0,0,0,0.25)] ${
              compact ? "h-[128px] w-[128px]" : "h-[116px] w-[116px]"
            }`}
          >
            {useImageIcons ? (
              <Image
                src={`/icons/${
                  metric.icon === "students"
                    ? "students-icon.png"
                    : metric.icon === "score"
                      ? "score-icon.png"
                      : metric.icon === "risk"
                        ? "at-risk-icon.png"
                        : "attendance-icon.png"
                }`}
                alt=""
                width={88}
                height={88}
                className="rounded-xl object-cover"
                aria-hidden="true"
              />
            ) : (
              <MetricIcon type={metric.icon} />
            )}
          </div>
          <p className={`mt-3 text-[#111] ${compact ? "text-base" : "text-sm"}`}>
            {metric.label}:{" "}
            <span className="font-bold">{metric.value}</span>
          </p>
          <div className="mx-auto mt-3 h-[2px] w-[70px] bg-gradient-to-r from-[#ff851b] to-[#d13be8]" />
        </div>
      ))}
    </div>
  );
}
