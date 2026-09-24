import type { ParentChild } from "@/lib/mockData";
import { StudentMetricIcon } from "./StudentMetricIcon";

const average = (values: number[]) =>
  values.length === 0
    ? 0
    : values.reduce((total, value) => total + value, 0) / values.length;

export function ParentMetricCards({
  childRecords,
}: {
  childRecords: ParentChild[];
}) {
  const scores = childRecords.flatMap((child) =>
    child.overall_score == null ? [] : [child.overall_score],
  );
  const attendance = childRecords.flatMap((child) =>
    child.attendance_percentage == null
      ? []
      : [child.attendance_percentage],
  );
  const metrics = [
    {
      label: "My Children",
      value: String(childRecords.length),
      icon: "score" as const,
    },
    {
      label: "Average Score",
      value: average(scores).toFixed(1),
      icon: "score" as const,
    },
    {
      label: "Average Attendance",
      value: `${average(attendance).toFixed(1)}%`,
      icon: "attendance" as const,
    },
    {
      label: "Needs Attention",
      value: String(
        childRecords.filter((child) => child.performance_level === "At Risk")
          .length,
      ),
      icon: "study" as const,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-8">
      {metrics.map((metric) => (
        <div className="text-center" key={metric.label}>
          <div className="mx-auto flex h-[128px] w-[128px] items-center justify-center rounded-xl bg-gradient-to-br from-[#a900f5] to-[#a400e8] text-white shadow-[2px_4px_5px_rgba(0,0,0,0.25)]">
            <StudentMetricIcon type={metric.icon} />
          </div>
          <p className="mt-3 text-base text-[#111]">
            {metric.label}: <span className="font-bold">{metric.value}</span>
          </p>
          <div className="mx-auto mt-3 h-[2px] w-[70px] bg-gradient-to-r from-[#ff851b] to-[#d13be8]" />
        </div>
      ))}
    </div>
  );
}
