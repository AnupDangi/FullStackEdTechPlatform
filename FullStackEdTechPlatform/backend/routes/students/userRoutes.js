const express = require('express');
const router = express.Router();
const userController = require('../../controllers/students/userController.js');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
// router.get('/profile', ...) // Later, with JWT middleware

module.exports = router;
