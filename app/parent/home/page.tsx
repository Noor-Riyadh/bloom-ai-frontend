"use client";

import { ParentMetricCards } from "@/components/ParentMetricCards";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { useEffect, useState } from "react";
import { getParentChildren } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import type { ParentChild } from "@/lib/mockData";

export default function ParentHomePage() {
  const [parent] = useState(() => getCurrentAuthUser());
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(parent?.email));
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
      .finally(() => setIsLoading(false));
  }, [parent]);

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="parent" />
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
                {parent?.name ?? "—"}
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          {isLoading ? (
            <p className="py-20 text-center text-xl text-[#a20bed]">
              Loading children data...
            </p>
          ) : error ? (
            <p className="py-20 text-center text-xl text-[#d83364]">{error}</p>
          ) : (
            <ParentMetricCards childRecords={children} />
          )}
          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-lg font-medium">
            You can view your children&apos;s academic performance and learning progress.
          </p>
        </div>
      </section>
    </main>
  );
}
