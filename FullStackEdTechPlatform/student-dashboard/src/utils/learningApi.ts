const LEARNING_URL = "http://localhost:5000/api/v1/student/learning";

export async function fetchCourseOutline(courseId: string, token: string) {
  const res = await fetch(`${LEARNING_URL}/course-outline/${courseId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch course outline');
  return res.json();
}

export async function fetchVideo(videoId: string, token: string) {
  const res = await fetch(`${LEARNING_URL}/video/${videoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch video');
  return res.json();
}
