import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/admin', // Change if needed
});


// Fetch students by course
export async function fetchCourseStudents(courseId: string) {
  const { data } = await api.get(`/analytics/course/${courseId}/students`);
  return data.students;
}

// Fetch student categories analytics
export async function fetchStudentCategories() {
  const { data } = await api.get("/analytics/students-categories");
  return data;
}


export default api;
