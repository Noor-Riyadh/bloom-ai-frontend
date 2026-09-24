"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StudentMetricIcon } from "@/components/StudentMetricIcon";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getStudentProfile } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { StudentProfile } from "@/lib/mockData";

function InfoIcon({ type }: { type: "class" | "teacher" | "school" }) {
  if (type === "class") {
    return (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
        <path d="M10 14h25c9 0 15 6 15 15v37H25c-8 0-15-6-15-14V14Zm60 0H45c-9 0-15 6-15 15v37h25c8 0 15-6 15-14V14Z" />
      </svg>
    );
  }
  if (type === "teacher") return <StudentMetricIcon type="score" />;
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
      <path d="M12 70V30l28-18 28 18v40H12Zm12 0V48h32v22M30 30h20M40 24v12" />
    </svg>
  );
}

export default function StudentMyLearningPage() {
  const [expanded, setExpanded] = useState(false);
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

  const academicPerformance = profile
    ? [
        { subject: "Assignment", score: profile.assignment_score },
        { subject: "Final Exam", score: profile.final_exam_score },
        { subject: "Midterm", score: profile.midterm_score },
        { subject: "Participation", score: profile.participation_score },
      ]
    : [];

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="student" />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1240px]">
          <header className="flex items-center gap-24">
            <Image
              src="/icons/MyLearning.png"
              alt=""
              width={280}
              height={280}
              className="h-auto w-[280px] rounded-xl object-contain"
              aria-hidden="true"
            />
            <div>
              <div className="mb-7 h-3 w-36 bg-[#b20cf0]" />
              <h1 className="text-5xl font-extrabold leading-none tracking-[-2px] text-[#a20bed]">
                My Learning
              </h1>
              <p className="mt-5 text-lg">Here is your current learning profile</p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section>
            {error ? (
              <p className="rounded-xl bg-[#fff0f0] px-6 py-5 text-center text-base font-medium text-[#a00000]">
                {error}
              </p>
            ) : !profile ? (
              <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-base font-medium">
                Loading your learning data...
              </p>
            ) : (
            <article className="overflow-hidden rounded-3xl bg-[#a900eb] text-white">
              <button
                type="button"
                className="flex min-h-[130px] w-full items-center gap-8 px-12 text-left"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
              >
                <span
                  className={`text-4xl leading-none transition-transform duration-300 ${
                    expanded ? "rotate-90" : ""
                  }`}
                  aria-hidden="true"
                >
                  ›
                </span>
                <StudentPlaceholder name={profile.name} />
                <span className="text-2xl font-medium">{profile.name}</span>
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                  expanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden bg-white text-[#111]">
                  <div className="border-b-8 border-[#a900eb] bg-[#a900eb] px-12 py-5">
                    <div className="flex items-center gap-6">
                      <StudentPlaceholder large name={profile.name} />
                      <span className="text-2xl font-semibold text-white">
                        {profile.name}
                      </span>
                    </div>
                  </div>

                  <section className="px-12 py-12">
                    <h2 className="mb-8 text-center text-3xl font-semibold text-[#a20bed]">
                      Academic Performance
                    </h2>
                    <div className="h-[380px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={academicPerformance}
                          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid stroke="#cfcfcf" vertical={false} />
                          <XAxis
                            dataKey="subject"
                            tick={{ fill: "#111", fontSize: 13 }}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "#a20bed", fontSize: 13 }}
                          />
                          <Tooltip />
                          <Bar dataKey="score" fill="#a900eb" barSize={80} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <div className="border-t-2 border-[#c02df1] px-12 py-10">
                    <div className="mx-auto grid max-w-[920px] grid-cols-[110px_1fr] gap-8">
                      <div className="flex flex-col items-center justify-around text-[#a900eb]">
                        <InfoIcon type="class" />
                        <InfoIcon type="teacher" />
                        <InfoIcon type="school" />
                      </div>
                      <div className="text-lg">
                        <p className="border-b border-[#c9c9c9] py-5">
                          <strong>Class:</strong> {profile.class_name ?? "—"}
                        </p>
                        <p className="border-b border-[#c9c9c9] py-5">
                          <strong>Teacher:</strong> {profile.teacher_name ?? "—"}
                        </p>
                        <p className="py-5">
                          <strong>School:</strong> {profile.school_name ?? "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
