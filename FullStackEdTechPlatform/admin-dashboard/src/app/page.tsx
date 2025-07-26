'use client';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-3xl">
        <Link href="/courses" className="block p-10 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-2xl hover:border-blue-400 transition-all duration-200 text-center group">
          <span className="text-2xl font-bold text-blue-700 group-hover:text-blue-800">All Courses</span>
          <div className="mt-3 text-gray-500">View and manage all courses in the platform</div>
        </Link>
        <Link href="/courses/create" className="block p-10 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-2xl hover:border-green-400 transition-all duration-200 text-center group">
          <span className="text-2xl font-bold text-green-700 group-hover:text-green-800">Create Course</span>
          <div className="mt-3 text-gray-500">Add a new course with thumbnail and details</div>
        </Link>
        {/* Analytics link card */}
        <Link href="/analytics" className="block p-10 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-2xl hover:border-purple-400 transition-all duration-200 text-center group">
          <span className="text-2xl font-bold text-purple-700 group-hover:text-purple-800">Analytics</span>
          <div className="mt-3 text-gray-500">View student analytics and enrolled students by course</div>
        </Link>
      </div>
    </div>
  );
}
