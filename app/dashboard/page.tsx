"use client";

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
import { TeacherMetricCards } from "@/components/TeacherMetricCards";
import { TeacherPageHeader } from "@/components/TeacherPageHeader";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { getTeacherStudents } from "@/lib/api";
import { getCurrentAuthUser } from "@/lib/auth";
import { getPerformanceDistribution, type Student } from "@/lib/mockData";

export default function TeacherDashboardPage() {
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

  const distribution = getPerformanceDistribution(students);

  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1050px]">
          <TeacherPageHeader title="Teacher" name="Dashboard" />
          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <h2 className="mb-10 text-center text-3xl font-semibold text-[#a20bed]">
            Students of {teacherName}
          </h2>
          {isLoading ? (
            <p className="py-20 text-center text-xl text-[#a20bed]">
              Loading student data...
            </p>
          ) : error ? (
            <p className="py-20 text-center text-xl text-[#d83364]">{error}</p>
          ) : (
            <TeacherMetricCards students={students} compact />
          )}

          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />

          {!isLoading && !error && (
            <section id="students">
              <h2 className="mb-6 text-center text-3xl font-semibold text-[#a20bed]">
                Class Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-left text-base">
                  <thead>
                    <tr className="bg-[#a900eb] text-white">
                      <th className="px-5 py-4 font-medium">Student</th>
                      <th className="px-5 py-4 font-medium">Class</th>
                      <th className="px-5 py-4 font-medium">Overall Score</th>
                      <th className="px-5 py-4 font-medium">Attendance</th>
                      <th className="px-5 py-4 font-medium">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr className="border-b border-[#d8d8d8]" key={student.name}>
                        <td className="flex items-center gap-4 px-5 py-4 font-medium">
                          <div className="h-12 w-12 rounded-xl border-2 border-[#a900eb] bg-gradient-to-br from-[#ffd0b0] via-[#f2a5b7] to-[#8f66cc]" />
                          {student.name}
                        </td>
                        <td className="px-5 py-4">{student.class_name ?? "—"}</td>
                        <td className="px-5 py-4">{student.overall_score}</td>
                        <td className="px-5 py-4">{student.attendance_percentage}%</td>
                        <td className="px-5 py-4">{student.performance_level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          {!isLoading && !error && (
            <section>
              <h2 className="mb-6 text-center text-3xl font-semibold text-[#a20bed]">
                Performance Distribution
              </h2>
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid stroke="#cfcfcf" vertical={false} />
                    <XAxis dataKey="performance_level" tick={{ fill: "#111", fontSize: 14 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#a20bed", fontSize: 14 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a900eb" barSize={120} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
