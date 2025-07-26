export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white text-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block text-blue-600">Learn Without Limits</span>
          <span className="block">Transform Your Future</span>
        </h1>
        <p className="mt-3 text-base text-gray-700 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
          Access world-class education from anywhere in the world. Join our platform
          to start your learning journey today.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/courses"
            className="rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Browse Courses
          </a>
          <a
            href="/auth/signup"
            className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-gray-50"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
