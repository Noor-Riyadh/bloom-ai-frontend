"use client";

import { useEffect, useState } from "react";
import { StudentMetricCards } from "@/components/StudentMetricCards";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getStudentProfile } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { StudentProfile } from "@/lib/mockData";

export default function StudentHomePage() {
  const [studentName] = useState(
    () => getCurrentAuthUser()?.name ?? "",
  );
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState(
    () => (studentName ? "" : "Could not identify the logged-in student."),
  );

  useEffect(() => {
    if (!studentName) return;

    void getStudentProfile(studentName)
      .then(setProfile)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Could not load student data");
      });
  }, [studentName]);

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="student" />
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
                {profile?.name ?? "Loading..."}
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          {error ? (
            <p className="rounded-xl bg-[#fff0f0] px-6 py-5 text-center text-lg font-medium text-[#a00000]">
              {error}
            </p>
          ) : profile ? (
            <StudentMetricCards studentProfile={profile} />
          ) : (
            <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-lg font-medium">
              Loading your learning data...
            </p>
          )}
          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-lg font-medium">
            You can view your learning performance and personalized learning information.
          </p>
        </div>
      </section>
    </main>
  );
}
