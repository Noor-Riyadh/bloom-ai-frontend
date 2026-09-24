import { StudentMetricCards } from "@/components/StudentMetricCards";
import { StudentPlaceholder } from "@/components/StudentPlaceholder";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { studentProfile } from "@/lib/mockData";

export default function StudentHomePage() {
  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar role="student" />
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
                {studentProfile.name}
              </p>
            </div>
          </header>

          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <StudentMetricCards />
          <div className="my-16 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <p className="rounded-xl bg-[#eeeeee] px-6 py-5 text-center text-lg font-medium">
            You can view your learning performance and personalized learning information.
          </p>
        </div>
      </section>
    </main>
  );
}
