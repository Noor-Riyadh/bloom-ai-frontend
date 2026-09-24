export type PerformanceLevel = "Average" | "Good" | "At Risk";

export interface Teacher {
  name: string;
}

export interface Student {
  name: string;
  class_name: string;
  parent_name: string;
  school_name: string;
  study_hours_per_day: number;
  overall_score: number;
  attendance_percentage: number;
  performance_level: PerformanceLevel;
}

export interface StudentProfile {
  name: string;
  class_name: string;
  teacher_name: string;
  school_name: string;
  overall_score: number;
  attendance_percentage: number;
  study_hours_per_day: number;
  performance_level: PerformanceLevel;
  assignment_score: number;
  final_exam_score: number;
  midterm_score: number;
  participation_score: number;
}

export const teacher: Teacher = {
  name: "Mr. Ahmed Khaled",
};

export const studentProfile: StudentProfile = {
  name: "Adham Ali",
  class_name: "5B",
  teacher_name: teacher.name,
  school_name: "Nile Future School",
  overall_score: 77.1,
  attendance_percentage: 44,
  study_hours_per_day: 6.9,
  performance_level: "Good",
  assignment_score: 90,
  final_exam_score: 78,
  midterm_score: 52,
  participation_score: 67,
};

export const students: Student[] = [
  {
    name: "Laila Mohamed",
    class_name: "5B",
    parent_name: "Laila’s Mother",
    school_name: "Nile Future School",
    study_hours_per_day: 8.8,
    overall_score: 65.6005,
    attendance_percentage: 51,
    performance_level: "Average",
  },
  {
    name: "Mariam Saad",
    class_name: "5B",
    parent_name: "Mariam’s Father",
    school_name: "Nile Future School",
    study_hours_per_day: 7.5,
    overall_score: 59.3555,
    attendance_percentage: 53,
    performance_level: "Average",
  },
  {
    name: "Mohamed Ahmed",
    class_name: "5B",
    parent_name: "Mohamed’s Mother",
    school_name: "Nile Future School",
    study_hours_per_day: 8.1,
    overall_score: 65.489,
    attendance_percentage: 55.5,
    performance_level: "Average",
  },
  {
    name: "Adham Ali",
    class_name: "5B",
    parent_name: "Adham’s Father",
    school_name: "Nile Future School",
    study_hours_per_day: 6.9,
    overall_score: 58.666,
    attendance_percentage: 57.5,
    performance_level: "Average",
  },
];

export function getStudentCount(studentList: Student[] = students) {
  return studentList.length;
}

export function getAverageScore(studentList: Student[] = students) {
  if (studentList.length === 0) return 0;
  return (
    studentList.reduce((total, student) => total + student.overall_score, 0) /
    studentList.length
  );
}

export function getAtRiskCount(studentList: Student[] = students) {
  return studentList.filter(
    (student) => student.performance_level === "At Risk",
  ).length;
}

export function getAverageAttendance(studentList: Student[] = students) {
  if (studentList.length === 0) return 0;
  return (
    studentList.reduce(
      (total, student) => total + student.attendance_percentage,
      0,
    ) / studentList.length
  );
}

export function getPerformanceDistribution(studentList: Student[] = students) {
  return (["Average", "Good", "At Risk"] as PerformanceLevel[]).map(
    (performance_level) => ({
      performance_level,
      count: studentList.filter(
        (student) => student.performance_level === performance_level,
      ).length,
    }),
  );
}
