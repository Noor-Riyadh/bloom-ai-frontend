"use client";

import { useEffect, useState } from "react";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherMetricCards } from "@/components/TeacherMetricCards";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getSchoolStudents } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { AdminStudent } from "@/lib/mockData";

export default function AdminHomePage() {
  const [schoolName] = useState(() => getCurrentAuthUser()?.name ?? "");
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(schoolName));
  const [error, setError] = useState(
    () => (schoolName ? "" : "Could not identify the logged-in school."),
  );

  useEffect(() => {
    if (!schoolName) return;

    void getSchoolStudents(schoolName)
      .then((data) => setStudents(data.students))
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
        <div className="mx-auto max-w-[1050px]">
          <header className="flex items-center gap-24">
            <StudentPlaceholder large />
            <div>
              <div className="mb-8 h-3 w-36 bg-[#b20cf0]" />
              <h1 className="text-7xl font-extrabold leading-none tracking-[-4px] text-[#a20bed]">
                Welcome
              </h1>
              <p className="mt-2 text-6xl font-extrabold leading-none tracking-[-3px]">
                {schoolName || "—"}
              </p>
              <p className="mt-5 text-2xl">
                AI Powered personalized learning for students, teachers, parents, and schools.
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          {isLoading ? (
            <p className="py-20 text-center text-xl text-[#a20bed]">
              Loading school data...
            </p>
          ) : error ? (
            <p className="py-20 text-center text-xl text-[#d83364]">{error}</p>
          ) : (
            <TeacherMetricCards students={students} />
          )}
          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-lg font-medium">
            You can monitor students and performance across your school.
          </p>
        </div>
      </section>
    </main>
  );
}
