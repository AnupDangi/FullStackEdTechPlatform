"use client";

import { useEffect, useState } from 'react';
import { getEnrollmentStatus } from '@/utils/enrollmentApi';

export default function ProfileSection() {
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const name = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';
    if (token && name) {
      setUser({ name });
      getEnrollmentStatus(token)
        .then(data => {
          setCourses(data.courses || []);
        })
        .catch(err => setError('Failed to fetch courses'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (!user) return <div className="text-center py-8 text-red-500">Not logged in.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div className="flex items-center gap-4 mb-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-2xl">{user.name.charAt(0).toUpperCase()}</span>
        <div>
          <div className="font-bold text-lg text-gray-900">{user.name}</div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Enrolled Courses</h3>
      {courses.length === 0 ? (
        <div className="text-gray-500">No courses enrolled yet.</div>
      ) : (
        <ul className="space-y-2">
          {courses.map((course: any) => (
            <li key={course._id} className="border rounded p-4">
              <div className="font-bold text-gray-900">{course.title}</div>
              <div className="text-gray-600 text-sm">{course.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
