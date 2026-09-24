import { TeacherMetricCards } from "@/components/TeacherMetricCards";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { school } from "@/lib/mockData";

export default function AdminDashboardPage() {
  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="admin" />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1100px]">
          <header className="flex items-center gap-20">
            <div className="w-60 text-[#a900eb]">
              <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
                <path d="M12 15h76v70H12V15Zm10 10v18h56V25H22Zm0 28v22h56V53H22Zm10-22h8v8h-8v-8Zm16 0h8v8h-8v-8Zm16 0h8v8h-8v-8ZM32 62h8v8h-8v-8Zm16 0h8v8h-8v-8Zm16 0h8v8h-8v-8Z" />
              </svg>
            </div>
            <div>
              <div className="mb-7 h-3 w-36 bg-[#b20cf0]" />
              <h1 className="text-7xl font-extrabold leading-none tracking-[-4px] text-[#a20bed]">
                School Dashboard
              </h1>
              <p className="mt-5 text-2xl">
                Showing students from <strong>{school.name}</strong> only.
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <TeacherMetricCards students={school.students} compact />

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <section>
            <h2 className="mb-8 text-center text-3xl font-semibold text-[#a20bed]">
              School Students
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-base">
                <thead>
                  <tr className="bg-[#a900eb] text-white">
                    <th className="px-5 py-4 font-medium">Student</th>
                    <th className="px-5 py-4 font-medium">Class</th>
                    <th className="px-5 py-4 font-medium">Teacher</th>
                    <th className="px-5 py-4 font-medium">Overall Score</th>
                    <th className="px-5 py-4 font-medium">Attendance</th>
                    <th className="px-5 py-4 font-medium">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {school.students.map((student) => (
                    <tr className="border-b border-[#d8d8d8]" key={student.name}>
                      <td className="px-5 py-5 font-medium">{student.name}</td>
                      <td className="px-5 py-5">{student.class_name}</td>
                      <td className="px-5 py-5">{student.teacher_name}</td>
                      <td className="px-5 py-5">{student.overall_score}</td>
                      <td className="px-5 py-5">{student.attendance_percentage}%</td>
                      <td className="px-5 py-5">{student.performance_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <section>
            <h2 className="mb-8 text-center text-3xl font-semibold text-[#a20bed]">
              Classes
            </h2>
            <table className="w-full border-collapse text-left text-base">
              <thead>
                <tr className="bg-[#a900eb] text-white">
                  <th className="px-5 py-4 font-medium">Class</th>
                  <th className="px-5 py-4 font-medium">Students</th>
                  <th className="px-5 py-4 font-medium">Average Score</th>
                  <th className="px-5 py-4 font-medium">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {school.classes.map((classSummary) => (
                  <tr className="border-b border-[#d8d8d8]" key={classSummary.class_name}>
                    <td className="px-5 py-5">{classSummary.class_name}</td>
                    <td className="px-5 py-5">{classSummary.student_count}</td>
                    <td className="px-5 py-5">{classSummary.average_score.toFixed(1)}</td>
                    <td className="px-5 py-5">{classSummary.average_attendance.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </main>
  );
}
