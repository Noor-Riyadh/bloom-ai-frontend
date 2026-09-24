"use client";

import { useEffect, useState } from "react";
import { TeacherMetricCards } from "@/components/TeacherMetricCards";
import { TeacherPageHeader } from "@/components/TeacherPageHeader";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getTeacherStudents } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { Student } from "@/lib/mockData";

export default function TeacherHomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacherName] = useState(
    () => getCurrentAuthUser()?.name ?? "Mr. Ahmed Khaled",
  );

  useEffect(() => {
    let active = true;
    getTeacherStudents(teacherName)
      .then((data) => {
        if (active) setStudents(data);
      })
      .catch(() => {
        if (active) setError("Could not load student data");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [teacherName]);

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1050px]">
          <TeacherPageHeader title="Welcome" name={teacherName} />
          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          {isLoading ? (
            <p className="py-20 text-center text-xl text-[#a20bed]">
              Loading student data...
            </p>
          ) : error ? (
            <p className="py-20 text-center text-xl text-[#d83364]">{error}</p>
          ) : (
            <TeacherMetricCards students={students} useImageIcons />
          )}
          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <p className="rounded-md bg-[#f0f0f0] px-5 py-2 text-center text-sm font-medium text-[#333]">
            You can view your assigned students, analyze their performance, and generate AI powered personalized learning plans.
          </p>
        </div>
      </section>
    </main>
  );
}
