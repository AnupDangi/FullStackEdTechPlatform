'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';


export default function CreateCoursePage() {
  const [form, setForm] = useState({ title: '', description: '', instructor: '', price: '' });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.files?.[0] || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      const res = await api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      const courseId = res.data.course?._id;
      if (courseId) {
        router.push(`/courses/${courseId}`);
      } else {
        setError('Course created but no ID returned.');
      }
    } catch (err: any) {
      setError('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Create New Course</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-5">
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="p-3 border rounded w-full text-black bg-white" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="p-3 border rounded w-full text-black bg-white" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Instructor</label>
            <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor" required className="p-3 border rounded w-full text-black bg-white" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Price (₹)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required className="p-3 border rounded w-full text-black bg-white" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleFile} required className="p-2 w-full" />
          </div>
          {error && <div className="text-red-600 font-medium text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
}
