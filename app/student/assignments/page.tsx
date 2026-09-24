"use client";

import { useEffect, useState } from "react";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import {
  getAssignmentQuestions,
  getAssignmentSubmission,
  getStudentAssignments,
  submitAssignment,
} from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type {
  AssignmentQuestionGrade,
  AssignmentQuestionSummary,
  AssignmentSubmission,
  StudentAssignment,
} from "@/lib/mockData";

function formatDate(value: string) {
  if (!value.trim()) return "—";
  const date = new Date(value.trim().replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

function statusIsSubmitted(status: string) {
  return status.trim().toLowerCase() === "submitted";
}

function GradeResult({ submission }: { submission: AssignmentSubmission }) {
  return (
    <section className="mt-6 rounded-xl bg-[#f7f3fa] p-6">
      <div className="rounded-xl bg-white p-5">
        <p className="text-xl font-bold text-[#a20bed]">
          Score: {submission.earned_points} / {submission.max_points} (
          {submission.percentage.toFixed(1)}%)
        </p>
        <p className="mt-2 text-base text-[#555]">
          Submitted: {formatDate(submission.submitted_at)}
        </p>
      </div>
      <div className="mt-5 space-y-4">
        {submission.grading.questions.map((grade: AssignmentQuestionGrade) => {
          const correct = grade.points_awarded >= grade.max_points;
          return (
            <article
              className={`rounded-xl border-l-4 bg-white p-5 ${
                correct ? "border-[#6eaa1f]" : "border-[#d83364]"
              }`}
              key={grade.question_number}
            >
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-base font-bold">
                  Question {grade.question_number}
                </h4>
                <span
                  className={`font-bold ${
                    correct ? "text-[#568500]" : "text-[#d83364]"
                  }`}
                >
                  {grade.points_awarded} / {grade.max_points}
                </span>
              </div>
              <p className="mt-2 text-base text-[#444]">{grade.feedback}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-5 rounded-xl bg-white p-5">
        <h4 className="text-base font-bold text-[#a20bed]">Overall Feedback</h4>
        <p className="mt-2 text-base text-[#444]">
          {submission.grading.overall_feedback || "—"}
        </p>
      </div>
    </section>
  );
}

function AssignmentCard({
  assignment,
  isOpen,
  onOpen,
}: {
  assignment: StudentAssignment;
  isOpen: boolean;
  onOpen: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#ead7f4] bg-[#fafafa]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#f7f0fc]"
        onClick={onOpen}
        aria-expanded={isOpen}
      >
        <span>
          <span className="block text-xl font-bold text-[#111]">
            {assignment.title}
          </span>
          <span className="mt-1 block text-base text-[#666]">
            {assignment.subject ?? "—"} · Created {formatDate(assignment.created_at)}
          </span>
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            statusIsSubmitted(assignment.status)
              ? "bg-[#eaf6d8] text-[#568500]"
              : "bg-[#fff0d9] text-[#b85b00]"
          }`}
        >
          {statusIsSubmitted(assignment.status) ? "Submitted" : "Pending"}
        </span>
      </button>
    </article>
  );
}

export default function StudentAssignmentsPage() {
  const [studentName] = useState(() => getCurrentAuthUser()?.name ?? "");
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<StudentAssignment | null>(null);
  const [questions, setQuestions] = useState<AssignmentQuestionSummary[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(studentName));
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(
    () => (studentName ? "" : "Could not identify the logged-in student."),
  );

  useEffect(() => {
    if (!studentName) return;

    let active = true;
    void getStudentAssignments(studentName)
      .then((data) => {
        if (active) setAssignments(data);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : "Could not load assignments",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [studentName]);

  async function openAssignment(assignment: StudentAssignment) {
    setSelectedAssignment(assignment);
    setQuestions([]);
    setAnswers([]);
    setSubmission(null);
    setError("");
    setIsLoadingDetails(true);

    try {
      if (statusIsSubmitted(assignment.status)) {
        setSubmission(
          await getAssignmentSubmission(assignment.id, studentName),
        );
      } else {
        const loadedQuestions = await getAssignmentQuestions(assignment.id);
        setQuestions(loadedQuestions);
        setAnswers(loadedQuestions.map(() => ""));
      }
    } catch (reason: unknown) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not load assignment details",
      );
    } finally {
      setIsLoadingDetails(false);
    }
  }

  async function handleSubmit() {
    if (!selectedAssignment) return;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitAssignment(
        selectedAssignment.id,
        studentName,
        answers,
      );
      setSubmission(result);
      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? { ...assignment, status: "Submitted" }
            : assignment,
        ),
      );
    } catch (reason: unknown) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not grade the assignment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="student" />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1050px]">
          <header className="flex items-center gap-8">
            <StudentPlaceholder large />
            <div>
              <div className="mb-4 h-2 w-24 bg-[#b20cf0]" />
              <h1 className="text-5xl font-extrabold leading-none tracking-[-2px] text-[#a20bed]">
                Assignments
              </h1>
              <p className="mt-3 text-lg text-[#555]">
                Complete your assignments and review your AI-graded feedback.
              </p>
            </div>
          </header>

          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          {isLoading ? (
            <p className="py-16 text-center text-lg text-[#a20bed]">
              Loading assignments...
            </p>
          ) : error && assignments.length === 0 ? (
            <p className="rounded-lg bg-[#fff0f0] px-5 py-4 text-base text-[#a00000]" role="alert">
              {error}
            </p>
          ) : assignments.length === 0 ? (
            <p className="rounded-xl bg-[#eeeeee] px-5 py-4 text-base text-[#555]">
              No assignments are available right now.
            </p>
          ) : (
            <section className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id}>
                  <AssignmentCard
                    assignment={assignment}
                    isOpen={selectedAssignment?.id === assignment.id}
                    onOpen={() => void openAssignment(assignment)}
                  />
                  {selectedAssignment?.id === assignment.id && (
                    <div className="mt-3 rounded-2xl bg-[#f7f3fa] p-6">
                      {isLoadingDetails ? (
                        <p className="text-base text-[#a20bed]">
                          Loading assignment...
                        </p>
                      ) : submission ? (
                        <GradeResult submission={submission} />
                      ) : (
                        <>
                          {questions.map((question, index) => (
                            <label
                              className="mb-5 block text-base font-semibold"
                              key={question.id}
                            >
                              {index + 1}. {question.question}
                              <textarea
                                className="mt-2 min-h-24 w-full rounded-xl border-2 border-transparent bg-[linear-gradient(white,white)_padding-box,linear-gradient(90deg,#ff851b,#d13be8)_border-box] px-4 py-3 text-base font-normal outline-none focus:ring-2 focus:ring-[#d64cf1]"
                                value={answers[index] ?? ""}
                                onChange={(event) =>
                                  setAnswers((current) =>
                                    current.map((answer, answerIndex) =>
                                      answerIndex === index
                                        ? event.target.value
                                        : answer,
                                    ),
                                  )
                                }
                              />
                            </label>
                          ))}
                          <button
                            type="button"
                            disabled={isSubmitting || questions.length === 0}
                            onClick={() => void handleSubmit()}
                            className="h-12 rounded-xl bg-gradient-to-r from-[#ff851b] via-[#f84e98] to-[#a900f5] px-6 text-sm font-bold uppercase text-white transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
                          >
                            {isSubmitting
                              ? "Grading your answers..."
                              : "Submit for AI Grading"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
          {error && assignments.length > 0 && (
            <p className="mt-5 rounded-lg bg-[#fff0f0] px-5 py-4 text-base text-[#a00000]" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
