"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchCourses } from '@/utils/api';
import { getEnrollmentStatus } from '@/utils/enrollmentApi';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  thumbnail: string;
}

interface EnrolledCourse {
  _id: string;
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch courses
        const coursesData = await fetchCourses();
        setCourses(coursesData.courses || []);

        // Check if user is logged in and get enrolled courses
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          setIsLoggedIn(true);
          try {
            const enrollmentData = await getEnrollmentStatus(token);
            setEnrolledCourses(enrollmentData.courses || []);
          } catch (err) {
            // User might not have any enrollments
            setEnrolledCourses([]);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching courses');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some(course => course._id === courseId);
  };

  const handleCourseAction = (courseId: string) => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    
    if (isEnrolled(courseId)) {
      router.push(`/learning/${courseId}`);
    } else {
      router.push(`/courses/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => {
        const enrolled = isEnrolled(course._id);
        return (
          <div key={course._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              {enrolled && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Enrolled
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                {course.title}
              </h3>
              
              <p className="text-gray-600 mb-3 line-clamp-2 text-sm min-h-[2.5rem]">
                {course.description}
              </p>
              
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">
                    {course.instructor.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Instructor</p>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">
                  {course.price === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span className="text-blue-600">₹{course.price.toLocaleString()}</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handleCourseAction(course._id)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                  enrolled 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {enrolled ? 'Continue Learning' : 'View Details'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
