const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/admin/analyticsController');

// List students by course
router.get('/course/:courseId/students', analyticsController.getStudentsByCourse);
// List all student categories
router.get('/students-categories', analyticsController.getStudentCategories);

module.exports = router;
