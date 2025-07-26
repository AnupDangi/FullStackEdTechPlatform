import CourseCatalog from '@/components/CourseCatalog';

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Browse Courses</h2>
      <CourseCatalog />
    </div>
  );
}
