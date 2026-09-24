import { TeacherMetricCards } from "@/components/TeacherMetricCards";
import { TeacherPageHeader } from "@/components/TeacherPageHeader";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { teacher } from "@/lib/mockData";

export default function TeacherHomePage() {
  return (
    <main className="flex min-h-screen bg-white text-[#111]">
      <TeacherSidebar />
      <section className="min-w-0 flex-1 px-16 py-20">
        <div className="mx-auto max-w-[1050px]">
          <TeacherPageHeader title="Welcome" name={teacher.name} />
          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <TeacherMetricCards />
          <div className="my-10 h-px w-full bg-gradient-to-r from-[#c02df1] to-[#b20cf0]" />
          <p className="rounded-md bg-[#f0f0f0] px-5 py-2 text-center text-sm font-medium text-[#333]">
            You can view your assigned students, analyze their performance, and generate AI powered personalized learning plans.
          </p>
        </div>
      </section>
    </main>
  );
}
