"use client";

import { useState } from "react";
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
import { studentProfile } from "@/lib/mockData";

const academicPerformance = [
  { subject: "Assignment", score: studentProfile.assignment_score },
  { subject: "Final Exam", score: studentProfile.final_exam_score },
  { subject: "Midterm", score: studentProfile.midterm_score },
  { subject: "Participation", score: studentProfile.participation_score },
];

function BookIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
      <path d="M10 14h25c9 0 15 6 15 15v37H25c-8 0-15-6-15-14V14Zm60 0H45c-9 0-15 6-15 15v37h25c8 0 15-6 15-14V14Z" />
    </svg>
  );
}

function InfoIcon({ type }: { type: "class" | "teacher" | "school" }) {
  if (type === "class") return <BookIcon />;
  if (type === "teacher") return <StudentMetricIcon type="score" />;
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
      <path d="M12 70V30l28-18 28 18v40H12Zm12 0V48h32v22M30 30h20M40 24v12" />
    </svg>
  );
}

export default function StudentMyLearningPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="student" />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1240px]">
          <header className="flex items-center gap-24">
            <div className="w-[280px] text-[#a900eb]">
              <BookIcon />
            </div>
            <div>
              <div className="mb-7 h-3 w-36 bg-[#b20cf0]" />
              <h1 className="text-7xl font-extrabold leading-none tracking-[-4px] text-[#a20bed]">
                My Learning
              </h1>
              <p className="mt-5 text-2xl">Here is your current learning profile</p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section>
            <article className="overflow-hidden rounded-3xl bg-[#a900eb] text-white">
              <button
                type="button"
                className="flex min-h-[130px] w-full items-center gap-8 px-12 text-left"
                onClick={() => setExpanded((value) => !value)}
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
                <span className="text-3xl font-medium">{studentProfile.name}</span>
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
                      <StudentPlaceholder large />
                      <span className="text-3xl font-semibold text-white">
                        {studentProfile.name}
                      </span>
                    </div>
                  </div>

                  <section className="px-12 py-12">
                    <h2 className="mb-8 text-center text-4xl font-semibold text-[#a20bed]">
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
                            tick={{ fill: "#111", fontSize: 16 }}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "#a20bed", fontSize: 16 }}
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
                      <div className="text-2xl">
                        <p className="border-b border-[#c9c9c9] py-5">
                          <strong>Class:</strong> {studentProfile.class_name}
                        </p>
                        <p className="border-b border-[#c9c9c9] py-5">
                          <strong>Teacher:</strong> {studentProfile.teacher_name}
                        </p>
                        <p className="py-5">
                          <strong>School:</strong> {studentProfile.school_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
