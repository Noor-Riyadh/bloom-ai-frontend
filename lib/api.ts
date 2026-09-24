import type {
  AdminClassSummary,
  AdminStudent,
  Assignment,
  AssignmentQuestion,
  AssignmentQuestionGrade,
  AssignmentQuestionSummary,
  AssignmentSubmission,
  ParentChild,
  Student,
  StudentAssignment,
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

function normalizeAssignment(value: Record<string, unknown>): Assignment {
  return {
    id: Number(value.id ?? 0),
    title: String(value.title ?? "Untitled assignment"),
    subject: typeof value.subject === "string" ? value.subject : null,
    created_at: String(value.created_at ?? ""),
  };
}

function normalizeStudentAssignment(
  value: Record<string, unknown>,
): StudentAssignment {
  return {
    ...normalizeAssignment(value),
    status: String(value.status ?? "Pending"),
  };
}

function normalizeAssignmentQuestion(
  value: Record<string, unknown>,
): AssignmentQuestionSummary {
  return {
    id: Number(value.id ?? 0),
    question_order: Number(value.question_order ?? 0),
    question: String(value.question ?? ""),
    max_points: Number(value.max_points ?? 0),
  };
}

function parseObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
  return {};
}

function normalizeSubmission(value: Record<string, unknown>): AssignmentSubmission {
  const rawGrading = parseObject(value.grading ?? value.grading_json);
  const rawQuestions = Array.isArray(rawGrading.questions)
    ? rawGrading.questions
    : Array.isArray(value.questions)
      ? value.questions
      : [];
  const questions: AssignmentQuestionGrade[] = rawQuestions
    .filter((question) => question && typeof question === "object")
    .map((question) => {
      const item = question as Record<string, unknown>;
      return {
        question_number: Number(item.question_number ?? item.question_order ?? 0),
        points_awarded: Number(item.points_awarded ?? 0),
        max_points: Number(item.max_points ?? 0),
        feedback: String(item.feedback ?? item.overall_feedback ?? "—"),
      };
    });

  const submittedAt = value.submitted_at ?? value.submittedAt;

  return {
    answers: Array.isArray(value.answers)
      ? value.answers.map((answer) => String(answer))
      : [],
    grading: {
      questions,
      overall_feedback: String(
        rawGrading.overall_feedback ??
          rawGrading.feedback ??
          value.overall_feedback ??
          "—",
      ),
      earned_points: Number(rawGrading.earned_points ?? value.earned_points ?? 0),
      max_points: Number(rawGrading.max_points ?? value.max_points ?? 0),
      percentage: Number(rawGrading.percentage ?? value.percentage ?? 0),
    },
    earned_points: Number(value.earned_points ?? 0),
    max_points: Number(value.max_points ?? 0),
    percentage: Number(value.percentage ?? 0),
    submitted_at: typeof submittedAt === "string" ? submittedAt : "",
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

export async function generateLearningPlan(
  studentName: string,
  age: number,
  preferredTopic: string,
  learningStyle: string,
  language: "en" | "ar",
): Promise<string> {
  if (!apiUrl) {
    throw new Error("AI service is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/ai-assistant/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_name: studentName,
        age,
        preferred_topic: preferredTopic,
        learning_style: learningStyle,
        language,
      }),
    });
  } catch {
    throw new Error(
      "Could not connect to the AI service. Please try again.",
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; plan?: unknown; detail?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.detail || "Could not generate a learning plan. Please try again.",
    );
  }

  if (
    !payload ||
    payload.success !== true ||
    typeof payload.plan !== "string" ||
    !payload.plan.trim()
  ) {
    throw new Error("The AI service returned an invalid learning plan.");
  }

  return payload.plan;
}

export async function createAssignment(
  teacherName: string,
  title: string,
  subject: string,
  instructions: string,
  questions: AssignmentQuestion[],
): Promise<Assignment> {
  if (!apiUrl) {
    throw new Error("Assignment service is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/assignments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacher_name: teacherName,
        title,
        subject,
        instructions,
        questions,
      }),
    });
  } catch {
    throw new Error(
      "Could not connect to the assignment service. Please try again.",
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | {
        success?: boolean;
        assignment?: Record<string, unknown>;
        detail?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.detail || "Could not create the assignment. Please try again.",
    );
  }

  if (
    !payload ||
    payload.success !== true ||
    !payload.assignment ||
    typeof payload.assignment !== "object"
  ) {
    throw new Error("The assignment service returned an invalid response.");
  }

  return normalizeAssignment(payload.assignment);
}

export async function getTeacherAssignments(
  teacherName: string,
): Promise<Assignment[]> {
  if (!apiUrl) {
    throw new Error("Assignment service is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/assignments/teacher/${encodeURIComponent(teacherName)}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load assignments");
  }

  const payload = (await response.json().catch(() => null)) as unknown;

  if (
    !response.ok ||
    !Array.isArray(payload) ||
    !payload.every((assignment) => assignment && typeof assignment === "object")
  ) {
    throw new Error("Could not load assignments");
  }

  return payload.map((assignment) =>
    normalizeAssignment(assignment as Record<string, unknown>),
  );
}

export async function getStudentAssignments(
  studentName: string,
): Promise<StudentAssignment[]> {
  if (!apiUrl) {
    throw new Error("Assignment service is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/assignments/student/${encodeURIComponent(studentName)}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load assignments");
  }

  const payload = (await response.json().catch(() => null)) as unknown;
  if (
    !response.ok ||
    !Array.isArray(payload) ||
    !payload.every((assignment) => assignment && typeof assignment === "object")
  ) {
    throw new Error("Could not load assignments");
  }

  return payload.map((assignment) =>
    normalizeStudentAssignment(assignment as Record<string, unknown>),
  );
}

export async function getAssignmentQuestions(
  assignmentId: number,
): Promise<AssignmentQuestionSummary[]> {
  if (!apiUrl) {
    throw new Error("Assignment service is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/assignments/${assignmentId}/questions`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load assignment questions");
  }

  const payload = (await response.json().catch(() => null)) as unknown;
  if (
    !response.ok ||
    !Array.isArray(payload) ||
    !payload.every((question) => question && typeof question === "object")
  ) {
    throw new Error("Could not load assignment questions");
  }

  return payload.map((question) =>
    normalizeAssignmentQuestion(question as Record<string, unknown>),
  );
}

export async function submitAssignment(
  assignmentId: number,
  studentName: string,
  answers: string[],
): Promise<AssignmentSubmission> {
  if (!apiUrl) {
    throw new Error("Assignment service is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student_name: studentName, answers }),
    });
  } catch {
    throw new Error(
      "Could not connect to the grading service. Please try again.",
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null;
  if (!response.ok || !payload || typeof payload !== "object") {
    const detail = payload?.detail;
    throw new Error(
      typeof detail === "string"
        ? detail
        : "Could not grade the assignment. Please try again.",
    );
  }

  return normalizeSubmission(payload);
}

export async function getAssignmentSubmission(
  assignmentId: number,
  studentName: string,
): Promise<AssignmentSubmission> {
  if (!apiUrl) {
    throw new Error("Assignment service is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/assignments/${assignmentId}/submission/${encodeURIComponent(studentName)}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not load assignment submission");
  }

  const payload = (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null;
  if (!response.ok || !payload || typeof payload !== "object") {
    const detail = payload?.detail;
    throw new Error(
      typeof detail === "string"
        ? detail
        : "Could not load assignment submission",
    );
  }

  return normalizeSubmission(payload);
}
