 "use client";

 import Image from "next/image";
 import { useEffect, useState } from "react";
import { TeacherMetricCards } from "@/components/TeacherMetricCards";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getSchoolStudents } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { AdminClassSummary, AdminStudent } from "@/lib/mockData";

export default function AdminDashboardPage() {
  const [schoolName] = useState(() => getCurrentAuthUser()?.name ?? "");
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [classes, setClasses] = useState<AdminClassSummary[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(schoolName));
  const [error, setError] = useState(
    () => (schoolName ? "" : "Could not identify the logged-in school."),
  );

  useEffect(() => {
    if (!schoolName) return;

    void getSchoolStudents(schoolName)
      .then((data) => {
        setStudents(data.students);
        setClasses(data.classes);
      })
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error ? reason.message : "Could not load school data",
        );
      })
      .finally(() => setIsLoading(false));
  }, [schoolName]);

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="admin" />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1100px]">
          <header className="flex items-center gap-16">
            <Image
              src="/icons/ParentDashboardicon1.png"
              alt=""
              width={160}
              height={160}
              className="h-40 w-40 object-contain"
              aria-hidden="true"
            />
            <div>
              <div className="mb-4 h-2 w-24 bg-[#b20cf0]" />
              <h1 className="text-4xl font-extrabold leading-none tracking-[-2px] text-[#a20bed]">
                School Dashboard
              </h1>
              <p className="mt-4 text-base">
                Showing students from                 <strong>{schoolName || "—"}</strong> only.
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          {isLoading ? (
            <p className="py-20 text-center text-lg text-[#a20bed]">
              Loading school data...
            </p>
          ) : error ? (
            <p className="py-20 text-center text-lg text-[#d83364]">{error}</p>
          ) : (
            <TeacherMetricCards students={students} compact useImageIcons />
          )}

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <section>
            <h2 className="mb-8 text-center text-2xl font-semibold text-[#a20bed]">
              School Students
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[#a900eb] text-white">
                    <th className="px-5 py-4 font-medium">Student</th>
                    <th className="px-5 py-4 font-medium">Class</th>
                    <th className="px-5 py-4 font-medium">Teacher</th>
                    <th className="px-5 py-4 font-medium">Overall Score</th>
                    <th className="px-5 py-4 font-medium">Attendance</th>
                    <th className="px-5 py-4 font-medium">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr className="border-b border-[#d8d8d8]" key={student.name}>
                      <td className="px-5 py-5 font-medium">{student.name}</td>
                      <td className="px-5 py-5">{student.class_name ?? "—"}</td>
                      <td className="px-5 py-5">{student.teacher_name ?? "—"}</td>
                      <td className="px-5 py-5">{student.overall_score ?? "—"}</td>
                      <td className="px-5 py-5">
                        {student.attendance_percentage == null
                          ? "—"
                          : `${student.attendance_percentage}%`}
                      </td>
                      <td className="px-5 py-5">{student.performance_level ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <section>
            <h2 className="mb-8 text-center text-2xl font-semibold text-[#a20bed]">
              Classes
            </h2>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#a900eb] text-white">
                  <th className="px-5 py-4 font-medium">Class</th>
                  <th className="px-5 py-4 font-medium">Students</th>
                  <th className="px-5 py-4 font-medium">Average Score</th>
                  <th className="px-5 py-4 font-medium">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classSummary) => (
                  <tr className="border-b border-[#d8d8d8]" key={classSummary.class_name}>
                    <td className="px-5 py-5">{classSummary.class_name ?? "—"}</td>
                    <td className="px-5 py-5">{classSummary.student_count}</td>
                    <td className="px-5 py-5">
                      {classSummary.average_score?.toFixed(1) ?? "—"}
                    </td>
                    <td className="px-5 py-5">
                      {classSummary.average_attendance == null
                        ? "—"
                        : `${classSummary.average_attendance.toFixed(1)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </main>
  );
}
