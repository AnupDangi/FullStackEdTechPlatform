const BASE_URL = 'http://localhost:5000/api/v1/students/';
const CATALOG_URL="http://localhost:5000/api/v1";
export async function fetchCourses() {
  const res = await fetch(`${CATALOG_URL}/catalog/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

export async function fetchCourseDetails(courseId: string) {
  const res = await fetch(`${CATALOG_URL}/catalog/courses/${courseId}/sections`);
  if (!res.ok) throw new Error('Failed to fetch course details');
  return res.json();
}

// You can add more API functions here as needed for other endpoints
