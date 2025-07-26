import { fetchCourseStudents } from "@/utils/api";
import { AnalyticsTable } from "../AnalyticsTable";

interface Params { params: { courseId: string } }

export default async function CourseStudentsPage({ params }: Params) {
  const students = await fetchCourseStudents(params.courseId);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Enrolled Students</h1>
      <AnalyticsTable students={students} />
    </div>
  );
} 