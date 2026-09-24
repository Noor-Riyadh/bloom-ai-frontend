"use client";

import { useEffect, useState } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { generateLearningPlan, getTeacherStudents } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { Student } from "@/lib/mockData";

function SparkleHeadingIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="currentColor" aria-hidden="true">
      <path d="m25 4 4.8 16.2L46 25l-16.2 4.8L25 46l-4.8-16.2L4 25l16.2-4.8L25 4Zm30 20 6 20 15 6-15 6-6 20-6-20-15-6 15-6 6-20Z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="currentColor" aria-hidden="true">
      <path d="M34 8a14 14 0 0 0-13 9 14 14 0 0 0-10 22 14 14 0 0 0 6 25 14 14 0 0 0 18 7V8Zm12 0v63a14 14 0 0 0 18-7 14 14 0 0 0 6-25 14 14 0 0 0-10-22A14 14 0 0 0 46 8ZM34 20a8 8 0 0 1 0 16m0 1a8 8 0 0 0 0 16m12-33a8 8 0 0 0 0 16m0 1a8 8 0 0 1 0 16" />
    </svg>
  );
}

function StudentRow({
  name,
  expanded,
  onToggle,
}: {
  name: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex min-h-[96px] w-full items-center gap-6 rounded-2xl bg-[#a900eb] px-8 text-left text-white transition hover:brightness-105"
      onClick={onToggle}
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
      <StudentPlaceholder />
      <span className="text-xl font-medium">{name}</span>
    </button>
  );
}

export default function AIAssistantPage() {
  const [teacherName] = useState(() => getCurrentAuthUser()?.name ?? "");
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(Boolean(teacherName));
  const [studentLoadError, setStudentLoadError] = useState(
    () => (teacherName ? "" : "Could not identify the logged-in teacher."),
  );
  const [selectedStudent, setSelectedStudent] = useState("");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [age, setAge] = useState(10);
  const [topic, setTopic] = useState("Math");
  const [style, setStyle] = useState("Visual");
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teacherName) return;

    let active = true;
    void getTeacherStudents(teacherName)
      .then((data) => {
        if (!active) return;
        setStudents(data);
        setSelectedStudent(data[0]?.name ?? "");
      })
      .catch(() => {
        if (active) setStudentLoadError("Could not load student data");
      })
      .finally(() => {
        if (active) setIsLoadingStudents(false);
      });

    return () => {
      active = false;
    };
  }, [teacherName]);

  async function generatePlan() {
    if (!selectedStudent) return;

    setIsGenerating(true);
    setPlan("");
    setError("");

    try {
      const generatedPlan = await generateLearningPlan(
        selectedStudent,
        age,
        topic,
        style,
      );
      setPlan(generatedPlan);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not generate a learning plan. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1050px]">
          <header className="flex items-center gap-14">
            <div className="w-28 text-[#a900eb]">
              <SparkleHeadingIcon />
            </div>
            <div>
              <div className="mb-5 h-2 w-24 bg-[#b20cf0]" />
              <h1 className="text-5xl font-extrabold leading-none tracking-[-2px] text-[#a20bed]">
                Bloom
              </h1>
              <p className="text-5xl font-extrabold leading-none tracking-[-2px]">
                AI Assistant
              </p>
            </div>
          </header>

          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <p className="rounded-lg bg-[#eeeeee] px-6 py-4 text-center text-base">
            You are logged in as <strong>{teacherName || "—"}</strong>. You can
            generate plans only for your assigned students.
          </p>

          <section className="mx-auto mt-8 max-w-[820px]">
            <label
              className="mb-5 block text-center text-xl font-medium uppercase text-[#a20bed]"
              htmlFor="ai-student-select"
            >
              Select Student
            </label>
            {isLoadingStudents ? (
              <p className="rounded-lg bg-[#eeeeee] px-5 py-4 text-center text-base text-[#a20bed]">
                Loading your assigned students...
              </p>
            ) : studentLoadError ? (
              <p className="rounded-lg bg-[#fff0f0] px-5 py-4 text-center text-base text-[#a00000]" role="alert">
                {studentLoadError}
              </p>
            ) : students.length === 0 ? (
              <p className="rounded-lg bg-[#eeeeee] px-5 py-4 text-center text-base text-[#555]">
                No students are assigned to this account.
              </p>
            ) : (
              <>
                <select
                  id="ai-student-select"
                  value={selectedStudent}
                  onChange={(event) => setSelectedStudent(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(90deg,#ff851b,#d13be8)_border-box] px-6 text-base outline-none"
                >
                  {students.map((student) => (
                    <option key={student.name}>{student.name}</option>
                  ))}
                </select>
                <div className="mt-8 space-y-3">
                  {students.map((student) => (
                    <StudentRow
                      key={student.name}
                      name={student.name}
                      expanded={expandedStudent === student.name}
                      onToggle={() =>
                        setExpandedStudent((current) =>
                          current === student.name ? null : student.name,
                        )
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </section>

          <div className="my-12 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section className="mx-auto max-w-[820px]">
            <div className="mb-10 flex items-center justify-center gap-5">
              <div className="w-20 text-[#a900eb]">
                <BrainIcon />
              </div>
              <div>
                <div className="mb-3 h-2 w-16 bg-[#b20cf0]" />
                <h2 className="text-4xl font-extrabold leading-none text-[#a20bed]">
                  Student
                </h2>
                <p className="text-4xl font-extrabold leading-none">
                  Learning Profile
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <label className="block text-center text-lg font-medium uppercase text-[#a20bed]" htmlFor="student-age">
                Student Age
                <span className="mt-2 flex h-12 items-center rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(90deg,#ff851b,#d13be8)_border-box] px-5 text-left text-base text-[#111]">
                  <input
                    id="student-age"
                    className="w-full bg-transparent outline-none"
                    type="number"
                    min={1}
                    max={100}
                    value={age}
                    onChange={(event) => setAge(Number(event.target.value))}
                  />
                  <button type="button" onClick={() => setAge((value) => Math.max(1, value - 1))} aria-label="Decrease age">−</button>
                  <span className="px-2">|</span>
                  <button type="button" onClick={() => setAge((value) => value + 1)} aria-label="Increase age">+</button>
                </span>
              </label>
              <label className="block text-center text-lg font-medium uppercase text-[#a20bed]" htmlFor="preferred-topic">
                Preferred Topic
                <select id="preferred-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-2 h-12 w-full rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(90deg,#ff851b,#d13be8)_border-box] px-5 text-left text-base font-normal uppercase text-[#111] outline-none">
                  <option>Math</option>
                  <option>English</option>
                  <option>Science</option>
                  <option>Art</option>
                </select>
              </label>
              <label className="block text-center text-lg font-medium uppercase text-[#a20bed]" htmlFor="learning-style">
                Learning Style
                <select id="learning-style" value={style} onChange={(event) => setStyle(event.target.value)} className="mt-2 h-12 w-full rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(90deg,#ff851b,#d13be8)_border-box] px-5 text-left text-base font-normal uppercase text-[#111] outline-none">
                  <option>Visual</option>
                  <option>Auditory</option>
                  <option>Reading / Writing</option>
                  <option>Kinesthetic</option>
                </select>
              </label>
              <p className="rounded-lg bg-[#eeeeee] px-5 py-4 text-base">
                Automatically Detected Weakest Area: <strong>Attendance</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={generatePlan}
              disabled={isGenerating || isLoadingStudents || !selectedStudent}
              className="mt-8 h-14 w-full rounded-xl bg-gradient-to-r from-[#ff851b] via-[#f84e98] to-[#a900f5] text-sm font-bold uppercase text-white transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
            >
              {isGenerating
                ? "Generating..."
                : error
                  ? "Retry Generation"
                  : "Generate Personalized Learning Plans"}
            </button>
            {error && (
              <p
                className="mt-4 rounded-lg bg-[#fff0f0] px-5 py-4 text-center text-base text-[#a00000]"
                role="alert"
              >
                {error}
              </p>
            )}
          </section>

          <section className="mt-16">
            <h2 className="flex items-center gap-4 text-5xl font-extrabold">
              <span aria-hidden="true">🧠</span> AI Learning Plan
            </h2>
            <p className="mt-2 text-lg text-[#555]">
              Here is a personalized learning plan for the student.
            </p>
            <div className="mt-8 min-h-32 rounded-xl bg-[#fafafa] p-8">
              {isGenerating ? (
                <div className="flex items-center gap-4 text-lg text-[#a20bed]" aria-live="polite">
                  <span className="h-7 w-7 animate-spin rounded-full border-4 border-[#d9b0ef] border-t-[#a900eb]" />
                  Generating your personalized plan...
                </div>
              ) : plan ? (
                <MarkdownContent content={plan} />
              ) : (
                <p className="text-lg text-[#777]">
                  Select a student and generate a plan to see personalized learning guidance.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
