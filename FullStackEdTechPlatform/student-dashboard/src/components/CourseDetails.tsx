"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCourseDetails, fetchCourses } from '@/utils/api';
import { getEnrollmentStatus } from '@/utils/enrollmentApi';

interface Video {
  title: string;
  description: string;
  duration: number;
}

interface Section {
  title: string;
  description: string;
  videos: Video[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  thumbnail: string;
}

export default function CourseDetails({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadCourseData() {
      try {
        const coursesData = await fetchCourses();
        const currentCourse = coursesData.courses?.find((c: Course) => c._id === courseId);
        if (currentCourse) {
          setCourse(currentCourse);
        }

        const sectionsData = await fetchCourseDetails(courseId);
        setSections(sectionsData.sections || []);

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          setIsLoggedIn(true);
          try {
            const enrollmentData = await getEnrollmentStatus(token);
            const enrolled = enrollmentData.courses?.some((c: any) => c._id === courseId);
            if (enrolled) {
              router.push(`/learning/${courseId}`);
              return;
            }
          } catch {}
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching course details');
      } finally {
        setLoading(false);
      }
    }
    loadCourseData();
  }, [courseId, router]);

  const handleEnroll = () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    router.push(`/enrollment/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-lg mb-4">{error || 'Course not found'}</div>
        <button 
          onClick={() => router.back()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{course.description}</p>
            
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-lg">
                  {course.instructor.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="text-lg font-semibold text-gray-900">{course.instructor}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {course.price === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span className="text-blue-600">₹{course.price.toLocaleString()}</span>
                )}
              </div>
              
              <button
                onClick={handleEnroll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
                onClick={() => setOpenSection(openSection === idx ? null : idx)}
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.videos.length} videos</p>
                </div>
                <span className="text-gray-400 text-xl">
                  {openSection === idx ? '−' : '+'}
                </span>
              </button>
              
              {openSection === idx && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 mb-4">{section.description}</p>
                  <div className="space-y-3">
                    {section.videos.map((video, vIdx) => (
                      <div key={vIdx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm font-medium">{vIdx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{video.title}</h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                        <div className="text-gray-400">🔒</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-blue-700 text-sm">Enroll to access all videos and course materials</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
