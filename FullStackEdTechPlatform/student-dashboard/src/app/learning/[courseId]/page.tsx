import LearningPage from '@/components/LearningPage';

export default async function LearningRoute({ params }: { params: { courseId: string } }) {
  // Await params if necessary (Next.js App Router)
  const awaitedParams = await params;
  return (
    <div className="max-w-4xl mx-auto py-12 bg-white text-black">
      <LearningPage courseId={awaitedParams.courseId} />
    </div>
  );
}
