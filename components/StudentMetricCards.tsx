import type { StudentProfile } from "@/lib/mockData";
import { StudentMetricIcon } from "./StudentMetricIcon";

export function StudentMetricCards({
  studentProfile,
}: {
  studentProfile: StudentProfile;
}) {
  const metrics = [
    {
      label: "Overall Score",
      value: studentProfile.overall_score.toFixed(1),
      icon: "score" as const,
    },
    {
      label: "Attendance",
      value: `${studentProfile.attendance_percentage.toFixed(1)}%`,
      icon: "attendance" as const,
    },
    {
      label: "Study Hours",
      value: studentProfile.study_hours_per_day.toFixed(1),
      icon: "study" as const,
    },
    {
      label: "Performance Level",
      value: studentProfile.performance_level,
      icon: "score" as const,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-10">
      {metrics.map((metric) => (
        <div className="text-center" key={metric.label}>
          <div className="mx-auto flex h-[155px] w-[155px] items-center justify-center rounded-xl bg-gradient-to-br from-[#a900f5] to-[#a400e8] text-white shadow-[2px_4px_5px_rgba(0,0,0,0.25)]">
            <StudentMetricIcon type={metric.icon} />
          </div>
          <p className="mt-3 text-lg text-[#111]">
            {metric.label}: <span className="font-bold">{metric.value}</span>
          </p>
          <div className="mx-auto mt-3 h-[2px] w-[70px] bg-gradient-to-r from-[#ff851b] to-[#d13be8]" />
        </div>
      ))}
    </div>
  );
}
