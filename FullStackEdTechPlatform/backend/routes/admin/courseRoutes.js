// const express = require('express');
// const router = express.Router();
// const courseController = require('../controllers/admin/courseController.js');
// const { uploadImage, uploadVideo } = require('../middlewares/admin/upload.js');



// //get all courses
// router.get('/courses', courseController.getAllCourses);

// // CREATE COURSE (with thumbnail)
// router.post('/courses', uploadImage.single('thumbnail'), courseController.createCourse);


// // GET COURSE DETAILS
// router.get('/courses/:courseId', courseController.getCourseDetails);

// // ADD SECTION (just JSON, NO FILE upload)
// router.post('/courses/:courseId/sections', courseController.addSection);

// // ADD VIDEO TO SECTION (with video file upload)
// router.post('/sections/:sectionId/videos', uploadVideo.single('video'), courseController.addVideoToSection);

// // Delete a course
// router.delete('/courses/:courseId', courseController.deleteCourse);
// // Delete a section
// router.delete('/sections/:sectionId', courseController.deleteSection);
// // Update course name
// router.patch('/courses/:courseId', courseController.updateCourseName);
// // Update section name
// router.patch('/sections/:sectionId', courseController.updateSectionName);
// // Update video title/description
// router.patch('/videos/:videoId', courseController.updateVideo);
// // Delete a video
// router.delete('/videos/:videoId', courseController.deleteVideo);

// module.exports = router;

const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/admin/courseController.js');
const { uploadImage, uploadVideo } = require('../../middlewares/admin/upload.js');

// Courses
router.post('/courses', uploadImage.single('thumbnail'), courseController.createCourse);
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:courseId', courseController.getCourseDetails);
router.patch('/courses/:courseId', courseController.updateCourse);
router.patch('/courses/:courseId/publish', courseController.publishCourse);
router.patch('/courses/:courseId/archive', courseController.archiveCourse);
router.delete('/courses/:courseId', courseController.deleteCourse);

// Sections
router.post('/courses/:courseId/sections', courseController.addSection);
router.delete('/sections/:sectionId', courseController.deleteSection);
router.patch('/sections/:sectionId', courseController.updateSectionName);

// Videos
router.post('/sections/:sectionId/videos', uploadVideo.single('video'), courseController.addVideoToSection);
router.patch('/videos/:videoId', courseController.updateVideo);
router.delete('/videos/:videoId', courseController.deleteVideo);

module.exports = router;
