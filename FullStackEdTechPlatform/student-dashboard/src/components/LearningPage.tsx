"use client";
import { useEffect, useState } from 'react';
import { fetchCourseOutline, fetchVideo } from '@/utils/learningApi';

interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
}

interface Section {
  title: string;
  description: string;
  videos: Video[];
}

export default function LearningPage({ courseId }: { courseId: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [videoDetails, setVideoDetails] = useState<any | null>(null);

  useEffect(() => {
    async function getCourseSections() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      try {
        const data = await fetchCourseOutline(courseId, token);
        setSections(data.course.sections || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching course content');
      } finally {
        setLoading(false);
      }
    }
    getCourseSections();
  }, [courseId]);

  async function handleVideoClick(video: Video) {
    setActiveVideo(video);
    setVideoDetails(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const details = await fetchVideo(video._id, token);
      setVideoDetails(details);
    } catch (err) {
      setVideoDetails({ error: 'Failed to load video details' });
    }
  }

  if (loading) return <div className="text-center py-8">Loading course content...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Course Content</h2>
      <div>
        <h3 className="text-xl font-semibold mb-4">Sections</h3>
        <ul className="space-y-4">
          {sections.map((section, idx) => (
            <li key={idx} className="border rounded p-4">
              <div className="font-bold text-lg text-gray-900">{section.title}</div>
              <p className="mt-2 text-gray-700">{section.description}</p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Videos</h4>
                <ul className="space-y-2">
                  {section.videos.map((video, vIdx) => (
                    <li key={vIdx} className="p-2 border rounded bg-gray-50 cursor-pointer" onClick={() => handleVideoClick(video)}>
                      <div className="font-medium text-blue-700">{video.title}</div>
                      <div className="text-gray-600 text-sm">{video.description}</div>
                      <div className="text-xs text-gray-500">Duration: {video.duration} sec</div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        {activeVideo && videoDetails && (
          <div className="mt-8 p-4 border rounded bg-gray-100">
            <h4 className="font-bold text-lg mb-2">Video Details</h4>
            {videoDetails.error ? (
              <div className="text-red-500">{videoDetails.error}</div>
            ) : (
              <>
                <div className="font-medium text-blue-700">{videoDetails.title}</div>
                <div className="text-gray-600 text-sm mb-2">{videoDetails.description}</div>
                <div className="text-xs text-gray-500 mb-2">Duration: {videoDetails.duration} sec</div>
                <video 
                  src={videoDetails.videoUrl} 
                  controls 
                  controlsList="nodownload" 
                  onContextMenu={(e) => e.preventDefault()} 
                  className="w-full max-w-xl"
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
