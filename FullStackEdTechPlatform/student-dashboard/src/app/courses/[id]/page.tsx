'use client';
import { useEffect, useState } from 'react';
import CourseDetails from '@/components/CourseDetails';
import { getEnrollmentStatus } from '@/utils/enrollmentApi';
import { useRouter } from 'next/navigation';

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const courseId = params.id;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkEnrollment() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const data = await getEnrollmentStatus(token);
          const enrolled = data.courses?.some((c: any) => c._id === courseId);
          setIsEnrolled(!!enrolled);
        } catch {}
      }
      setLoading(false);
    }
    checkEnrollment();
  }, [courseId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 bg-white text-black">
      {isEnrolled ? (
        <div className="mb-8 flex items-center gap-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg">✓</span>
          <span className="font-medium text-green-700">Already Enrolled</span>
          <button
            className="ml-4 rounded bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
            onClick={() => router.push(`/learning/${courseId}`)}
          >
            Go to Course
          </button>
        </div>
      ) : null}
      <CourseDetails courseId={courseId} />
    </div>
  );
}
