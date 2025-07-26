const express = require('express');
const router = express.Router();
const learningController = require('../../controllers/students/LearningController.js');
const studentAuth = require('../../middlewares/students/auth.js');

// Get outline for an enrolled course
router.get('/course-outline/:courseId', studentAuth, learningController.getCourseOutline);
router.get('/video/:videoId', studentAuth, learningController.getVideoAccess);

module.exports = router;
