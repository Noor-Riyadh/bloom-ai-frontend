"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getTeacherStudents } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import {
  StudentMetricIcon,
  type StudentMetricIconType,
} from "@/components/StudentMetricIcon";
import type { Student } from "@/lib/mockData";

function StudentPlaceholder({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`shrink-0 rounded-xl border-2 border-[#ff9b24] bg-gradient-to-br from-[#ffd6b4] via-[#f4aec0] to-[#7652c4] ${
        large ? "h-28 w-28" : "h-20 w-20"
      }`}
      aria-label="Student photo placeholder"
    />
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={`text-5xl leading-none transition-transform duration-300 ${
        expanded ? "rotate-90" : ""
      }`}
      aria-hidden="true"
    >
      ›
    </span>
  );
}

function DetailMetric({
  icon,
  label,
  value,
}: {
  icon: StudentMetricIconType;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl bg-[#a900eb] text-white shadow-[3px_5px_5px_rgba(0,0,0,0.22)]">
        <StudentMetricIcon type={icon} />
      </div>
      <p className="mt-5 text-2xl">{label}</p>
      <p className="text-4xl font-extrabold text-[#a900eb]">{value}</p>
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [teacherName] = useState(
    () => getCurrentAuthUser()?.name ?? "Mr. Ahmed Khaled",
  );

  useEffect(() => {
    let active = true;
    getTeacherStudents(teacherName)
      .then((data) => {
        if (!active) return;
        setStudents(data);
        setSelectedStudent(data[0]?.name ?? "");
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

  function toggleStudent(name: string) {
    setExpandedStudent((current) => (current === name ? null : name));
  }

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1240px]">
          <header className="flex items-center gap-24">
            <div className="h-[305px] w-[400px] rounded-xl border-2 border-transparent bg-[linear-gradient(135deg,#f7d7bd,#b8a6cb)_padding-box,linear-gradient(135deg,#ff851b,#d13be8)_border-box]" />
            <div>
              <div className="mb-8 h-3 w-36 bg-[#b20cf0]" />
              <h1 className="text-7xl font-extrabold leading-none tracking-[-4px]">
                My Students!
              </h1>
              <p className="mt-5 text-2xl">
                You are reviewing the students assigned to {teacherName}.
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          {isLoading ? (
            <p className="py-20 text-center text-xl text-[#a20bed]">
              Loading student data...
            </p>
          ) : error ? (
            <p className="py-20 text-center text-xl text-[#d83364]">{error}</p>
          ) : <><section className="mx-auto max-w-[1050px]">
            <label
              className="mb-8 block text-center text-4xl font-medium uppercase text-[#a20bed]"
              htmlFor="student-select"
            >
              Select Student
            </label>
            <select
              id="student-select"
              value={selectedStudent}
              onChange={(event) => setSelectedStudent(event.target.value)}
              className="h-20 w-full appearance-none rounded-3xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(90deg,#ff851b,#d13be8)_border-box] px-12 text-2xl outline-none"
            >
              {students.map((student) => (
                <option key={student.name}>{student.name}</option>
              ))}
            </select>
          </section>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section className="mx-auto max-w-[1240px] space-y-4">
            {students.map((student) => {
              const expanded = expandedStudent === student.name;

              return (
                <article
                  className={`overflow-hidden rounded-3xl bg-[#a900eb] text-white transition-shadow ${
                    expanded ? "shadow-[0_8px_18px_rgba(0,0,0,0.2)]" : ""
                  }`}
                  key={student.name}
                >
                  <button
                    type="button"
                    className="flex min-h-[130px] w-full items-center gap-8 px-12 text-left"
                    onClick={() => toggleStudent(student.name)}
                    aria-expanded={expanded}
                  >
                    <Chevron expanded={expanded} />
                    <StudentPlaceholder />
                    <span className="text-3xl font-medium">{student.name}</span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                      expanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden bg-[#f1f1f1] text-[#111]">
                      <div className="border-b-8 border-[#a900eb] bg-[#a900eb] px-12 py-5">
                        <div className="flex items-center gap-6">
                          <StudentPlaceholder large />
                          <span className="text-3xl font-semibold text-white">
                            {student.name}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr] gap-8 px-12 py-12">
                        <DetailMetric
                          icon="score"
                          label="Overall Score"
                          value={student.overall_score.toFixed(1)}
                        />
                        <DetailMetric
                          icon="attendance"
                          label="Attendance"
                          value={`${student.attendance_percentage.toFixed(1)}%`}
                        />
                        <DetailMetric
                          icon="study"
                          label="Study Hours"
                          value={student.study_hours_per_day.toFixed(1)}
                        />
                        <div className="border-l-2 border-[#c9c9c9] pl-10 text-2xl">
                          <p className="border-b border-[#c9c9c9] py-5">
                            <strong>Class:</strong> {student.class_name ?? "—"}
                          </p>
                          <p className="border-b border-[#c9c9c9] py-5">
                            <strong>Parent:</strong> {student.parent_name ?? "—"}
                          </p>
                          <p className="py-5">
                            <strong>School:</strong> {student.school_name ?? "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
          </>}
        </div>
      </section>
    </main>
  );
}
