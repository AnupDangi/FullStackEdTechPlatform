'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';

type Course = {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  publishDate?: string;
};

export default function CoursesListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [publishConfirm, setPublishConfirm] = useState<string | null>(null);
  const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null);

  const loadCourses = () => {
    api.get('/courses')
      .then(res => {
        setCourses(res.data.courses);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load courses');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handlePublish = async (courseId: string) => {
    setActionLoading(courseId);
    try {
      await api.patch(`/courses/${courseId}/publish`);
      loadCourses();
    } catch (err) {
      console.error('Failed to publish course');
    }
    setActionLoading(null);
    setPublishConfirm(null);
  };

  const handleArchive = async (courseId: string) => {
    setActionLoading(courseId);
    try {
      await api.patch(`/courses/${courseId}/archive`);
      loadCourses();
    } catch (err) {
      console.error('Failed to archive course');
    }
    setActionLoading(null);
    setArchiveConfirm(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
          <Link href="/courses/create" className="bg-blue-600 px-6 py-2 text-white rounded-lg shadow hover:bg-blue-700 transition">+ Add Course</Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-20 text-lg">Loading courses...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-20 text-lg">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course._id} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 p-5 flex flex-col">
                <img src={course.thumbnail} alt={course.title} className="h-48 w-full object-cover rounded-xl mb-4 border" />
                <h2 className="font-bold text-xl text-gray-900 mb-1 truncate">{course.title}</h2>
                <div className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">By {course.instructor}</span>
                  <span className="text-base font-semibold text-green-700">₹{course.price}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'published' ? 'bg-green-100 text-green-800' :
                    course.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  {(course.status === 'draft' || course.status === 'archived') && (
                    <button
                      onClick={() => setPublishConfirm(course._id)}
                      disabled={actionLoading === course._id}
                      className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === course._id ? 'Publishing...' : 'Publish'}
                    </button>
                  )}
                  {course.status === 'published' && (
                    <button
                      onClick={() => setArchiveConfirm(course._id)}
                      disabled={actionLoading === course._id}
                      className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                    >
                      {actionLoading === course._id ? 'Archiving...' : 'Archive'}
                    </button>
                  )}
                </div>
                <Link href={`/courses/${course._id}`} className="mt-auto inline-block text-blue-600 font-medium hover:underline">Manage Course</Link>
              </div>
            ))}
          </div>
        )}

        {/* Publish Confirmation Modal */}
        {publishConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Publish Course</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to publish this course? It will be visible to students.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setPublishConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePublish(publishConfirm)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Modal */}
        {archiveConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Archive Course</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to archive this course? It will be hidden from students.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setArchiveConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleArchive(archiveConfirm)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
