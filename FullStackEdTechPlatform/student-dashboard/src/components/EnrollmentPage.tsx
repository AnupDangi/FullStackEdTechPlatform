"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { enrollCourse, getEnrollmentStatus } from '@/utils/enrollmentApi';

export default function EnrollmentPage({ courseId }: { courseId: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function enroll() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/auth/login');
        return;
      }
      try {
        const res = await enrollCourse(courseId, token);
        setStatus(res.message || 'Enrolled successfully!');
      } catch (err: any) {
        setStatus(err.message || 'Enrollment failed');
      } finally {
        setLoading(false);
      }
    }
    enroll();
  }, [courseId, router]);

  useEffect(() => {
    if (status && status.toLowerCase().includes('success')) {
      setTimeout(() => {
        router.push(`/learning/${courseId}`);
      }, 2000);
    }
  }, [status, courseId, router]);

  if (loading) return <div className="text-center py-8">Processing enrollment...</div>;
  const handlePayment = () => {
    // Route to dummy Stripe payment gateway
    window.location.href = `/payment/stripe?courseId=${courseId}`;
  };
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Enrollment Status</h2>
      <div className={`mb-4 text-lg ${status?.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-500'}`}>{status}</div>
      {status?.toLowerCase().includes('success') && <div className="text-gray-700">Redirecting to course...</div>}
      {status && status.toLowerCase().includes('failed') && (
        <button
          onClick={handlePayment}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Complete Payment
        </button>
      )}
    </div>
  );
}
