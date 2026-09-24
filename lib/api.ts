import type { Student } from "@/lib/mockData";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function normalizeStudent(value: Record<string, unknown>): Student {
  return {
    name: String(value.name ?? value.student_name ?? "Unnamed student"),
    class_name:
      typeof value.class_name === "string" ? value.class_name : null,
    teacher_name: String(value.teacher_name ?? ""),
    parent_name:
      typeof value.parent_name === "string" ? value.parent_name : null,
    school_name:
      typeof value.school_name === "string" ? value.school_name : null,
    study_hours_per_day: Number(value.study_hours_per_day ?? 0),
    overall_score: Number(value.overall_score ?? 0),
    attendance_percentage: Number(value.attendance_percentage ?? 0),
    performance_level:
      value.performance_level === "Good" || value.performance_level === "At Risk"
        ? value.performance_level
        : "Average",
  };
}

export async function getTeacherStudents(
  teacherName: string,
): Promise<Student[]> {
  if (!apiUrl) {
    throw new Error("Student data is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/teacher/${encodeURIComponent(teacherName)}/students`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load student data");
  }

  const payload = (await response.json().catch(() => null)) as
    | Student[]
    | { students?: unknown }
    | null;

  if (!response.ok) {
    throw new Error("Could not load student data");
  }

  const rawStudents = Array.isArray(payload)
    ? payload
    : payload && Array.isArray(payload.students)
      ? payload.students
      : null;

  if (!rawStudents || !rawStudents.every((student) => student && typeof student === "object")) {
    throw new Error("Could not load student data");
  }

  return rawStudents.map((student) =>
    normalizeStudent(student as Record<string, unknown>),
  );
}
