"use client";

import { useEffect, useState } from "react";
import { StudentMetricIcon } from "@/components/StudentMetricIcon";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getParentChildren } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { ParentChild } from "@/lib/mockData";

function DetailIcon({ type }: { type: "class" | "teacher" | "school" }) {
  if (type === "class") return <StudentMetricIcon type="study" />;
  if (type === "teacher") return <StudentMetricIcon type="score" />;
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      aria-hidden="true"
    >
      <path d="M12 70V30l28-18 28 18v40H12Zm12 0V48h32v22M30 30h20M40 24v12" />
    </svg>
  );
}

export default function ParentDashboardPage() {
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const [parent] = useState(() => getCurrentAuthUser());
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(Boolean(parent?.email));
  const [error, setError] = useState(
    () => (parent?.email ? "" : "Could not identify the logged-in parent."),
  );

  useEffect(() => {
    if (!parent?.email) return;

    void getParentChildren(parent.email)
      .then(setChildren)
      .catch((reason: unknown) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not load children data",
        );
      })
      .finally(() => setLoading(false));
  }, [parent]);

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="parent" />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1240px]">
          <header className="flex items-center gap-24">
            <div className="w-[280px] text-[#a900eb]">
              <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
                <path d="M12 15h76v70H12V15Zm10 10v18h56V25H22Zm0 28v22h56V53H22Zm10-22h8v8h-8v-8Zm16 0h8v8h-8v-8Zm16 0h8v8h-8v-8ZM32 62h8v8h-8v-8Zm16 0h8v8h-8v-8Zm16 0h8v8h-8v-8Z" />
              </svg>
            </div>
            <div>
              <div className="mb-7 h-3 w-36 bg-[#b20cf0]" />
              <h1 className="text-7xl font-extrabold leading-none tracking-[-4px] text-[#a20bed]">
                Parent Dashboard
              </h1>
              <p className="mt-5 text-2xl">
                Showing only the children linked to{" "}
                <strong>{parent?.name ?? "—"}</strong>
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section className="flex items-center gap-12 px-12">
            <div className="flex h-56 w-56 items-center justify-center rounded-3xl bg-gradient-to-br from-[#a900f5] to-[#a400e8] text-white shadow-[3px_5px_5px_rgba(0,0,0,0.22)]">
              <StudentMetricIcon type="score" />
            </div>
            <div>
              <p className="text-4xl">
                My Children: <strong>{children.length}</strong>
              </p>
              <div className="mt-8 h-1 w-44 bg-gradient-to-r from-[#ff851b] to-[#d13be8]" />
            </div>
          </section>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section className="space-y-4">
            {error ? (
              <p className="rounded-xl bg-[#fff0f0] px-6 py-5 text-center text-lg font-medium text-[#a00000]">
                {error}
              </p>
            ) : loading ? (
              <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-lg font-medium">
                Loading your children...
              </p>
            ) : children.length === 0 ? (
              <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-lg font-medium">
                No children are linked to this account.
              </p>
            ) : children.map((child) => {
              const expanded = expandedChild === child.name;

              return (
                <article className="overflow-hidden rounded-3xl bg-[#a900eb] text-white" key={child.name}>
                  <button
                    type="button"
                    className="flex min-h-[130px] w-full items-center gap-8 px-12 text-left"
                    onClick={() =>
                      setExpandedChild((current) =>
                        current === child.name ? null : child.name,
                      )
                    }
                    aria-expanded={expanded}
                  >
                    <span
                      className={`text-5xl leading-none transition-transform duration-300 ${
                        expanded ? "rotate-90" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <StudentPlaceholder />
                    <span className="text-3xl font-medium">{child.name}</span>
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
                            {child.name}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr] gap-8 px-12 py-12">
                        <div className="text-center">
                          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl bg-[#a900eb] text-white">
                            <StudentMetricIcon type="score" />
                          </div>
                          <p className="mt-5 text-2xl">Overall Score</p>
                          <p className="text-4xl font-extrabold text-[#a900eb]">{child.overall_score?.toFixed(1) ?? "—"}</p>
                        </div>
                        <div className="text-center">
                          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl bg-[#a900eb] text-white">
                            <StudentMetricIcon type="attendance" />
                          </div>
                          <p className="mt-5 text-2xl">Attendance</p>
                          <p className="text-4xl font-extrabold text-[#a900eb]">{child.attendance_percentage == null ? "—" : `${child.attendance_percentage.toFixed(1)}%`}</p>
                        </div>
                        <div className="text-center">
                          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl bg-[#a900eb] text-white">
                            <StudentMetricIcon type="study" />
                          </div>
                          <p className="mt-5 text-2xl">Study Hours</p>
                          <p className="text-4xl font-extrabold text-[#a900eb]">{child.study_hours_per_day?.toFixed(1) ?? "—"}</p>
                        </div>
                        <div className="border-l-2 border-[#c9c9c9] pl-10 text-2xl">
                          <p className="flex items-center gap-3 border-b border-[#c9c9c9] py-5">
                            <span className="h-7 w-7 text-[#a900eb]"><DetailIcon type="class" /></span>
                            <span><strong>Class:</strong> {child.class_name ?? "—"}</span>
                          </p>
                          <p className="flex items-center gap-3 border-b border-[#c9c9c9] py-5">
                            <span className="h-7 w-7 text-[#a900eb]"><DetailIcon type="teacher" /></span>
                            <span><strong>Teacher:</strong> {child.teacher_name ?? "—"}</span>
                          </p>
                          <p className="flex items-center gap-3 py-5">
                            <span className="h-7 w-7 text-[#a900eb]"><DetailIcon type="school" /></span>
                            <span><strong>School:</strong> {child.school_name ?? "—"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </main>
  );
}
