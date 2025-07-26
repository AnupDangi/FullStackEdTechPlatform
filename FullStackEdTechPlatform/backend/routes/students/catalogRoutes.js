const express = require('express');
const router = express.Router();
const catalogController = require('../../controllers/students/catalogController.js');

// Catalog (public)
router.get('/courses', catalogController.listCatalog);
router.get('/courses/:courseId/sections', catalogController.getCourseSections);

module.exports = router;
