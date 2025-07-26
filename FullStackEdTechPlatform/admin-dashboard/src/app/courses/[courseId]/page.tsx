'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
}
interface Section {
  _id: string;
  title: string;
  videos: Video[];
}
interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  publishDate?: string;
  sections: Section[];
}

// Custom Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  description 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
  description?: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          {description && (
            <p className="text-gray-600 mb-4 text-sm">{description}</p>
          )}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default function CourseManagePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [videoData, setVideoData] = useState({ title: '', description: '', video: null as File | null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectionLoading, setSectionLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [deletingCourse, setDeletingCourse] = useState(false);
  const [sectionEditId, setSectionEditId] = useState<string | null>(null);
  const [sectionEditTitle, setSectionEditTitle] = useState('');
  const [sectionDeleteId, setSectionDeleteId] = useState<string | null>(null);
  const [videoEditId, setVideoEditId] = useState<string | null>(null);
  const [videoEditData, setVideoEditData] = useState({ title: '', description: '' });
  const [videoDeleteId, setVideoDeleteId] = useState<string | null>(null);
  const [addVideoModalSection, setAddVideoModalSection] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [publishConfirm, setPublishConfirm] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState(false);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data.course);
      setLoading(false);
    } catch (err) {
      setError('Failed to load course');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line
  }, [courseId]);

  const addSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;
    setSectionLoading(true);
    await api.post(`/courses/${courseId}/sections`, { title: sectionTitle });
    setSectionTitle('');
    setSectionLoading(false);
    loadCourse();
  };

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addVideoModalSection || !videoData.title || !videoData.video) return;
    setVideoLoading(true);
    const fd = new FormData();
    fd.append('title', videoData.title);
    fd.append('description', videoData.description);
    fd.append('video', videoData.video);
    await api.post(`/sections/${addVideoModalSection}/videos`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setVideoData({ title: '', description: '', video: null });
    setAddVideoModalSection(null);
    setVideoLoading(false);
    loadCourse();
  };

  // Edit Course Name
  const handleEditCourse = () => {
    setEditingCourse(true);
    setNewCourseTitle(course?.title || '');
  };
  const handleUpdateCourse = async () => {
    if (!newCourseTitle.trim()) return;
    await api.patch(`/courses/${courseId}`, { title: newCourseTitle });
    setEditingCourse(false);
    loadCourse();
  };
  // Delete Course
  const handleDeleteCourse = async () => {
    await api.delete(`/courses/${courseId}`);
    setDeletingCourse(false);
    router.push('/courses');
  };
  // Edit Section Name
  const handleEditSection = (sec: Section) => {
    setSectionEditId(sec._id);
    setSectionEditTitle(sec.title);
  };
  const handleUpdateSection = async (sectionId: string) => {
    if (!sectionEditTitle.trim()) return;
    await api.patch(`/sections/${sectionId}`, { title: sectionEditTitle });
    setSectionEditId(null);
    setSectionEditTitle('');
    loadCourse();
  };
  // Delete Section
  const handleDeleteSection = async (sectionId: string) => {
    await api.delete(`/sections/${sectionId}`);
    setSectionDeleteId(null);
    loadCourse();
  };
  // Edit Video
  const handleEditVideo = (v: Video) => {
    setVideoEditId(v._id);
    setVideoEditData({ title: v.title, description: v.description });
  };
  const handleUpdateVideo = async (videoId: string) => {
    await api.patch(`/videos/${videoId}`, videoEditData);
    setVideoEditId(null);
    setVideoEditData({ title: '', description: '' });
    loadCourse();
  };
  // Delete Video
  const handleDeleteVideo = async (videoId: string) => {
    await api.delete(`/videos/${videoId}`);
    setVideoDeleteId(null);
    loadCourse();
  };

  // Publish Course
  const handlePublishCourse = async () => {
    setPublishLoading(true);
    try {
      await api.patch(`/courses/${courseId}/publish`);
      loadCourse();
    } catch (err) {
      console.error('Failed to publish course');
    }
    setPublishLoading(false);
    setPublishConfirm(false);
  };

  // Archive Course
  const handleArchiveCourse = async () => {
    setArchiveLoading(true);
    try {
      await api.patch(`/courses/${courseId}/archive`);
      loadCourse();
    } catch (err) {
      console.error('Failed to archive course');
    }
    setArchiveLoading(false);
    setArchiveConfirm(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-lg text-gray-500">Loading course...</div>;
  if (error || !course) return <div className="min-h-screen flex items-center justify-center bg-white text-lg text-red-500">{error || 'Course not found'}</div>;

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Course Header */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
          <img src={course.thumbnail} alt={course.title} className="w-44 h-44 object-cover rounded-xl border shadow-md" />
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-gray-900 break-words">{course.title}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium w-fit ${
                  course.status === 'published' ? 'bg-green-100 text-green-800' :
                  course.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(course.status === 'draft' || course.status === 'archived') && (
                  <Button 
                    onClick={() => setPublishConfirm(true)} 
                    disabled={publishLoading}
                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {publishLoading ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
                {course.status === 'published' && (
                  <Button 
                    onClick={() => setArchiveConfirm(true)} 
                    disabled={archiveLoading}
                    variant="outline" 
                    className="text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {archiveLoading ? 'Archiving...' : 'Archive'}
                  </Button>
                )}
                <Button onClick={handleEditCourse} variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50">Edit</Button>
                <Button onClick={() => setDeletingCourse(true)} variant="outline" className="text-red-700 border-red-200 hover:bg-red-50">Delete</Button>
              </div>
            </div>
            {/* Add analytics link below title and actions */}
            <div className="mt-4">
              <a
                href={`/analytics/${course._id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-sm font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Enrolled Students
              </a>
            </div>
            <p className="text-gray-700 text-lg break-words">{course.description}</p>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm text-gray-500">By <span className="font-semibold">{course.instructor}</span></span>
              <span className="inline-block bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-base shadow">₹{course.price}</span>
            </div>
          </div>
        </div>

        {/* Edit Course Modal */}
        <Modal
          isOpen={editingCourse}
          onClose={() => setEditingCourse(false)}
          title="Edit Course Title"
        >
          <form onSubmit={e => { e.preventDefault(); handleUpdateCourse(); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
              <Input
                value={newCourseTitle}
                onChange={e => setNewCourseTitle(e.target.value)}
                className="w-full text-lg px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="Enter course title"
                autoFocus
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingCourse(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Course Modal */}
        <Modal
          isOpen={deletingCourse}
          onClose={() => setDeletingCourse(false)}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your course."
        >
          <div className="flex gap-2">
            <Button
              onClick={() => setDeletingCourse(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCourse}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </Button>
          </div>
        </Modal>

        {/* Add Section */}
        <div className="mb-8">
          <form onSubmit={addSection} className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow">
            <Input
              value={sectionTitle}
              onChange={e => setSectionTitle(e.target.value)}
              placeholder="New Section Title"
              required
              className="flex-1 text-lg"
              disabled={sectionLoading}
            />
            <Button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              disabled={sectionLoading}
            >
              {sectionLoading ? 'Adding...' : 'Add Section'}
            </Button>
            {sectionLoading && <span className="ml-2 animate-spin inline-block w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"></span>}
          </form>
        </div>

        {/* Add Video Modal */}
        <Modal
          isOpen={addVideoModalSection !== null}
          onClose={() => setAddVideoModalSection(null)}
          title={`Add New Video to Section: ${course.sections.find(s => s._id === addVideoModalSection)?.title || ''}`}
        >
          <form onSubmit={addVideo} className="space-y-4">
            <Input
              type="text"
              placeholder="Video Title"
              value={videoData.title}
              onChange={(e) => setVideoData(v => ({ ...v, title: e.target.value }))}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={videoLoading}
            />
            <Textarea
              placeholder="Video Description"
              value={videoData.description}
              onChange={(e) => setVideoData(v => ({ ...v, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={videoLoading}
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoData(v => ({ ...v, video: e.target.files?.[0] || null }))}
              required
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={videoLoading}
            />
            <div className="flex gap-2 items-center">
              <Button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={videoLoading}
              >
                {videoLoading ? 'Uploading...' : 'Upload Video'}
              </Button>
              <Button
                type="button"
                onClick={() => setAddVideoModalSection(null)}
                className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={videoLoading}
              >
                Cancel
              </Button>
              {videoLoading && <span className="ml-2 animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></span>}
            </div>
          </form>
        </Modal>

        {/* Sections List */}
        <div className="space-y-10">
          <h2 className="font-bold text-2xl mb-4 text-gray-900">Sections</h2>
          {(!course.sections || course.sections.length === 0) && <div className="text-gray-400 mb-8">No sections yet.</div>}
          {Array.isArray(course.sections) && course.sections.map(sec => (
            <div key={sec._id} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-2">
                {sectionEditId === sec._id ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <Input
                      value={sectionEditTitle}
                      onChange={e => setSectionEditTitle(e.target.value)}
                      className="flex-1 text-lg"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button onClick={() => handleUpdateSection(sec._id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">Save</Button>
                      <Button onClick={() => { setSectionEditId(null); setSectionEditTitle(''); }} variant="secondary" className="text-xs">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-xl text-gray-800 break-words">{sec.title}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEditSection(sec)} variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50 text-xs">Edit</Button>
                      <Button onClick={() => setSectionDeleteId(sec._id)} variant="outline" className="text-red-700 border-red-200 hover:bg-red-50 text-xs">Delete</Button>
                      <Button onClick={() => setAddVideoModalSection(sec._id)} variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50 text-xs">+ Add Video</Button>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-3">
                {(!sec.videos || sec.videos.length === 0) && <div className="text-sm text-gray-400">No videos in this section.</div>}
                {Array.isArray(sec.videos) && sec.videos.map(v => (
                  <div key={v._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col shadow-sm mt-2 space-y-2">
                    {videoEditId === v._id ? (
                      <>
                        <Input value={videoEditData.title} onChange={e => setVideoEditData(d => ({ ...d, title: e.target.value }))} className="mb-2 text-lg" />
                        <Textarea value={videoEditData.description} onChange={e => setVideoEditData(d => ({ ...d, description: e.target.value }))} className="mb-2 text-base" rows={3} />
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateVideo(v._id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</Button>
                          <Button onClick={() => setVideoEditId(null)} variant="secondary">Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-gray-900 text-lg break-words">{v.title}</span>
                        <span className="text-xs text-gray-500 mb-1 break-words">{v.description}</span>
                        <a href={v.videoUrl} target="_blank" className="text-blue-600 underline text-xs hover:text-blue-800">Watch Video</a>
                        <div className="flex gap-2 mt-2">
                          <Button onClick={() => handleEditVideo(v)} variant="outline" className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-xs">Edit</Button>
                          <Button onClick={() => setVideoDeleteId(v._id)} variant="outline" className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 text-xs">Delete</Button>
                        </div>
                      </>
                    )}
                    {/* Delete Video Modal */}
                    <Modal
                      isOpen={videoDeleteId === v._id}
                      onClose={() => setVideoDeleteId(null)}
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. This will permanently delete this video."
                    >
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setVideoDeleteId(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleDeleteVideo(v._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </Button>
                      </div>
                    </Modal>
                  </div>
                ))}
              </div>
              {/* Delete Section Modal */}
              <Modal
                isOpen={sectionDeleteId === sec._id}
                onClose={() => setSectionDeleteId(null)}
                title="Are you absolutely sure?"
                description="This action cannot be undone. This will permanently delete this section and all its videos."
              >
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSectionDeleteId(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteSection(sec._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </Button>
                </div>
              </Modal>
            </div>
          ))}
        </div>

        {/* Publish Confirmation Modal */}
        <Modal
          isOpen={publishConfirm}
          onClose={() => setPublishConfirm(false)}
          title="Publish Course"
          description="Are you sure you want to publish this course? It will be visible to students."
        >
          <div className="flex gap-2">
            <Button
              onClick={() => setPublishConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublishCourse}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Publish
            </Button>
          </div>
        </Modal>

        {/* Archive Confirmation Modal */}
        <Modal
          isOpen={archiveConfirm}
          onClose={() => setArchiveConfirm(false)}
          title="Archive Course"
          description="Are you sure you want to archive this course? It will be hidden from students."
        >
          <div className="flex gap-2">
            <Button
              onClick={() => setArchiveConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleArchiveCourse}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Archive
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}