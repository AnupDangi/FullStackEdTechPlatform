const express = require('express');
const router = express.Router();
const enrollmentController = require('../../controllers/students/EnrollmentController.js');
const studentAuth = require('../../middlewares/students/auth.js');

// Enroll in a course
router.post('/enroll', studentAuth, enrollmentController.enroll);

// Simulate payment success
router.patch('/enroll/activate/:enrollmentId', studentAuth, enrollmentController.activateEnrollment);

// List my enrolled courses (only 'active' enrollments)
router.get('/my-courses', studentAuth, enrollmentController.myEnrollments);

module.exports = router;
