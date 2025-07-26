export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} 360WorldEducation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
