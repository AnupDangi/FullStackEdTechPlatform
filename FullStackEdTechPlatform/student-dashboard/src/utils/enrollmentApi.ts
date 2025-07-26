const ENROLLMENT_URL = "http://localhost:5000/api/v1/student";

export async function enrollCourse(courseId: string, token: string) {
  const res = await fetch(`${ENROLLMENT_URL}/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ courseId }),
  });
  if (!res.ok) throw new Error('Enrollment failed');
  return res.json();
}

export async function getEnrollmentStatus(token: string) {
  const res = await fetch(`${ENROLLMENT_URL}/my-courses`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch enrollment status');
  return res.json();
}
