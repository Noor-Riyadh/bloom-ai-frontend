"use client";

import { FormEvent, useEffect, useState } from "react";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import {
  createAssignment,
  getTeacherAssignments,
} from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type {
  Assignment,
  AssignmentQuestion,
} from "@/lib/mockData";

const emptyQuestion = (): AssignmentQuestion => ({
  question: "",
  model_answer: "",
  max_points: 1,
});

const inputClass =
  "w-full rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(90deg,#ff851b,#d13be8)_border-box] px-4 py-3 text-base outline-none placeholder:text-[#777] focus:ring-2 focus:ring-[#d64cf1]";

function formatAssignmentDate(value: string): string {
  if (!value.trim()) return "—";

  const parsed = new Date(value.trim().replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

export default function AssignmentsPage() {
  const [teacherName] = useState(() => getCurrentAuthUser()?.name ?? "");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([
    emptyQuestion(),
    emptyQuestion(),
  ]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(teacherName));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(
    () => (teacherName ? "" : "Could not identify the logged-in teacher."),
  );
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!teacherName) return;

    let active = true;
    void getTeacherAssignments(teacherName)
      .then((data) => {
        if (active) setAssignments(data);
      })
      .catch((reason: unknown) => {
        if (active) {
          setLoadError(
            reason instanceof Error
              ? reason.message
              : "Could not load assignments",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [teacherName]);

  function updateQuestion(
    index: number,
    field: keyof AssignmentQuestion,
    value: string,
  ) {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              [field]:
                field === "max_points" ? Math.max(0, Number(value)) : value,
            }
          : question,
      ),
    );
  }

  function addQuestion() {
    setQuestions((current) => [...current, emptyQuestion()]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!teacherName) {
      setSubmitError("Could not identify the logged-in teacher.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccess("");

    try {
      const assignment = await createAssignment(
        teacherName,
        title.trim(),
        subject.trim(),
        instructions.trim(),
        questions,
      );
      setAssignments((current) => [assignment, ...current]);
      setTitle("");
      setSubject("");
      setInstructions("");
      setQuestions([emptyQuestion(), emptyQuestion()]);
      setSuccess("Assignment created successfully.");
    } catch (reason: unknown) {
      setSubmitError(
        reason instanceof Error
          ? reason.message
          : "Could not create the assignment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1050px]">
          <header>
            <div className="mb-5 h-2 w-24 bg-[#b20cf0]" />
            <h1 className="text-5xl font-extrabold leading-none tracking-[-2px] text-[#a20bed]">
              Assignments
            </h1>
            <p className="mt-4 text-lg text-[#555]">
              Create assignments for your students and review your existing work.
            </p>
          </header>

          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section className="rounded-2xl bg-[#f7f3fa] p-8">
            <h2 className="text-3xl font-bold text-[#a20bed]">
              Create New Assignment
            </h2>
            <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block text-base font-semibold">
                  Title
                  <input
                    required
                    className={`${inputClass} mt-2`}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Fractions Practice"
                  />
                </label>
                <label className="block text-base font-semibold">
                  Subject
                  <input
                    required
                    className={`${inputClass} mt-2`}
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="e.g. Mathematics"
                  />
                </label>
              </div>
              <label className="block text-base font-semibold">
                Instructions
                <textarea
                  required
                  className={`${inputClass} mt-2 min-h-28 resize-y`}
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder="Explain what students should complete..."
                />
              </label>

              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-bold text-[#a20bed]">Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="rounded-lg border-2 border-[#a900eb] px-4 py-2 text-sm font-bold text-[#a900eb] transition hover:bg-[#a900eb] hover:text-white"
                  >
                    Add Question
                  </button>
                </div>
                {questions.map((question, index) => (
                  <fieldset
                    className="rounded-xl border border-[#e2c9ed] bg-white p-5"
                    key={index}
                  >
                    <legend className="px-2 text-lg font-bold text-[#a20bed]">
                      Question {index + 1}
                    </legend>
                    <div className="mt-2 space-y-4">
                      <label className="block text-base font-semibold">
                        Question Text
                        <textarea
                          required
                          className={`${inputClass} mt-2 min-h-24 resize-y`}
                          value={question.question}
                          onChange={(event) =>
                            updateQuestion(index, "question", event.target.value)
                          }
                        />
                      </label>
                      <label className="block text-base font-semibold">
                        Model Answer
                        <textarea
                          required
                          className={`${inputClass} mt-2 min-h-24 resize-y`}
                          value={question.model_answer}
                          onChange={(event) =>
                            updateQuestion(
                              index,
                              "model_answer",
                              event.target.value,
                            )
                          }
                        />
                      </label>
                      <label className="block max-w-48 text-base font-semibold">
                        Max Points
                        <input
                          required
                          min={0.1}
                          step="0.1"
                          type="number"
                          className={`${inputClass} mt-2`}
                          value={question.max_points}
                          onChange={(event) =>
                            updateQuestion(
                              index,
                              "max_points",
                              event.target.value,
                            )
                          }
                        />
                      </label>
                    </div>
                  </fieldset>
                ))}
              </div>

              {(submitError || success) && (
                <p
                  className={`rounded-lg px-4 py-3 text-base ${
                    submitError
                      ? "bg-[#fff0f0] text-[#a00000]"
                      : "bg-[#eff9df] text-[#568500]"
                  }`}
                  role="status"
                >
                  {submitError || success}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-xl bg-gradient-to-r from-[#ff851b] via-[#f84e98] to-[#a900f5] px-7 text-sm font-bold uppercase text-white transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? "Creating..." : "Create Assignment"}
              </button>
            </form>
          </section>

          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          <section>
            <h2 className="text-3xl font-bold text-[#a20bed]">
              Your Assignments
            </h2>
            {isLoading ? (
              <p className="py-12 text-center text-lg text-[#a20bed]">
                Loading assignments...
              </p>
            ) : loadError ? (
              <p className="mt-5 rounded-lg bg-[#fff0f0] px-5 py-4 text-base text-[#a00000]" role="alert">
                {loadError}
              </p>
            ) : assignments.length === 0 ? (
              <p className="mt-5 rounded-xl bg-[#eeeeee] px-5 py-4 text-base text-[#555]">
                No assignments have been created yet.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {assignments.map((assignment) => (
                  <article
                    className="rounded-xl border border-[#ead7f4] bg-[#fafafa] px-6 py-5"
                    key={assignment.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-bold text-[#111]">
                        {assignment.title}
                      </h3>
                      <span className="rounded-full bg-[#eee0f8] px-3 py-1 text-sm font-semibold text-[#8b10c6]">
                        {assignment.subject ?? "—"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#666]">
                      Created: {formatAssignmentDate(assignment.created_at)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
