const Enrollment = require('../../models/students/Enrollment.js');
const Course = require('../../models/admin/Course.js'); // Make sure this is the right path

// ENROLL in a course
exports.enroll = async (req, res) => {
  try {
    const { courseId, paymentMethod, paymentRef } = req.body;
    const userId = req.user.userId;

    // Check if course exists and published
    const course = await Course.findById(courseId);
    if (!course || course.status !== "published")
      return res.status(404).json({ message: "Course not found or not published." });

    // Prevent duplicate enrollment
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(409).json({ message: "Already enrolled." });
    }

    // Free vs Paid logic
    let isFreeCourse = course.price === 0;
    let enrollmentData = {
      userId,
      courseId,
      enrolledAt: new Date(),
      paymentMethod: isFreeCourse ? 'free' : (paymentMethod || 'unknown'),
      paymentRef: isFreeCourse ? 'free' : (paymentRef || ''),
      paymentDone: isFreeCourse,
      status: isFreeCourse ? 'active' : 'pending'
    };

    const enrollment = await Enrollment.create(enrollmentData);
    res.status(201).json({
      message: isFreeCourse
        ? "Enrollment successful (free course)"
        : "Enrollment pending payment",
      enrollment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Simulate payment success
exports.activateEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    enrollment.paymentDone = true;
    enrollment.status = 'active';
    await enrollment.save();

    res.json({ message: "Enrollment activated (payment received)", enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all enrolled courses for student
exports.myEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const enrollments = await Enrollment.find({ userId, status: 'active' }).populate({
      path: 'courseId',
      select: '-__v'
    });
    res.json({
      enrollments,
      courses: enrollments.map(enr => enr.courseId)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
