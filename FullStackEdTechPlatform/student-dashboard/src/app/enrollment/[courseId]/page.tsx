import EnrollmentPage from '@/components/EnrollmentPage';

export default function EnrollmentRoute({ params }: { params: { courseId: string } }) {
  return (
    <div className="max-w-3xl mx-auto py-12 bg-white text-black">
      <EnrollmentPage courseId={params.courseId} />
    </div>
  );
}
