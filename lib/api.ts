import type {
  AdminClassSummary,
  AdminStudent,
  ParentChild,
  Student,
  StudentProfile,
} from "@/lib/mockData";

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

function normalizeStudentProfile(value: Record<string, unknown>): StudentProfile {
  return {
    name: String(value.name ?? value.student_name ?? "Unnamed student"),
    class_name: typeof value.class_name === "string" ? value.class_name : null,
    teacher_name:
      typeof value.teacher_name === "string" ? value.teacher_name : null,
    school_name:
      typeof value.school_name === "string" ? value.school_name : null,
    overall_score: Number(value.overall_score ?? 0),
    attendance_percentage: Number(value.attendance_percentage ?? 0),
    study_hours_per_day: Number(value.study_hours_per_day ?? 0),
    performance_level:
      value.performance_level === "Good" || value.performance_level === "At Risk"
        ? value.performance_level
        : "Average",
    assignment_score: Number(value.assignment_score ?? 0),
    final_exam_score: Number(value.final_exam_score ?? 0),
    midterm_score: Number(value.midterm_score ?? 0),
    participation_score: Number(value.participation_score ?? 0),
  };
}

function nullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeParentChild(value: Record<string, unknown>): ParentChild {
  const performanceLevel = value.performance_level;

  return {
    name: String(value.name ?? value.student_name ?? "Unnamed student"),
    class_name: typeof value.class_name === "string" ? value.class_name : null,
    teacher_name:
      typeof value.teacher_name === "string" ? value.teacher_name : null,
    school_name:
      typeof value.school_name === "string" ? value.school_name : null,
    overall_score: nullableNumber(value.overall_score),
    attendance_percentage: nullableNumber(value.attendance_percentage),
    study_hours_per_day: nullableNumber(value.study_hours_per_day),
    performance_level:
      performanceLevel === "Average" ||
      performanceLevel === "Good" ||
      performanceLevel === "At Risk"
        ? performanceLevel
        : null,
    assignment_score: nullableNumber(value.assignment_score),
    final_exam_score: nullableNumber(value.final_exam_score),
    midterm_score: nullableNumber(value.midterm_score),
    participation_score: nullableNumber(value.participation_score),
  };
}

function normalizeAdminStudent(value: Record<string, unknown>): AdminStudent {
  const performanceLevel = value.performance_level;

  return {
    name: String(value.name ?? value.student_name ?? "Unnamed student"),
    class_name: typeof value.class_name === "string" ? value.class_name : null,
    teacher_name:
      typeof value.teacher_name === "string" ? value.teacher_name : null,
    overall_score: nullableNumber(value.overall_score),
    attendance_percentage: nullableNumber(value.attendance_percentage),
    performance_level:
      performanceLevel === "At_Risk"
        ? "At Risk"
        : performanceLevel === "Average" || performanceLevel === "Good"
          ? performanceLevel
          : null,
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

export async function getStudentProfile(
  studentName: string,
): Promise<StudentProfile> {
  if (!apiUrl) {
    throw new Error("Student data is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/student/${encodeURIComponent(studentName)}/profile`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load student data");
  }

  const payload = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!response.ok || !payload || typeof payload !== "object") {
    throw new Error("Could not load student data");
  }

  return normalizeStudentProfile(payload);
}

export async function getParentChildren(
  parentEmail: string,
): Promise<ParentChild[]> {
  if (!apiUrl) {
    throw new Error("Parent data is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/parent/${encodeURIComponent(parentEmail)}/children`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load children data");
  }

  const payload = (await response.json().catch(() => null)) as
    | { children?: unknown }
    | null;

  if (!response.ok || !payload || !Array.isArray(payload.children)) {
    throw new Error("Could not load children data");
  }

  if (
    !payload.children.every(
      (child) => child && typeof child === "object",
    )
  ) {
    throw new Error("Could not load children data");
  }

  return payload.children.map((child) =>
    normalizeParentChild(child as Record<string, unknown>),
  );
}

export async function getSchoolStudents(schoolName: string): Promise<{
  students: AdminStudent[];
  classes: AdminClassSummary[];
}> {
  if (!apiUrl) {
    throw new Error("School data is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/admin/${encodeURIComponent(schoolName)}/students`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load school data");
  }

  const payload = (await response.json().catch(() => null)) as
    | {
        students?: unknown;
        classes?: unknown;
      }
    | null;

  if (
    !response.ok ||
    !payload ||
    !Array.isArray(payload.students) ||
    !Array.isArray(payload.classes)
  ) {
    throw new Error("Could not load school data");
  }

  if (
    !payload.students.every(
      (student) => student && typeof student === "object",
    ) ||
    !payload.classes.every(
      (classSummary) => classSummary && typeof classSummary === "object",
    )
  ) {
    throw new Error("Could not load school data");
  }

  return {
    students: payload.students.map((student) =>
      normalizeAdminStudent(student as Record<string, unknown>),
    ),
    classes: payload.classes.map((classSummary) => {
      const value = classSummary as Record<string, unknown>;
      return {
        class_name:
          typeof value.class_name === "string" ? value.class_name : null,
        student_count: Number(value.student_count ?? 0),
        average_score: nullableNumber(value.average_score),
        average_attendance: nullableNumber(value.average_attendance),
      };
    }),
  };
}
