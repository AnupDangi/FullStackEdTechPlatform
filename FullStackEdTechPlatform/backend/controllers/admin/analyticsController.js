// controllers/admin/analyticsController.js

const StudentUser = require('../../models/students/User.js');
const Enrollment = require('../../models/students/Enrollment.js');

exports.getStudentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ courseId, status: 'active' })
      .populate({ path: 'userId', select: 'name email' });

    // Format nicely for frontend
    const students = enrollments.map(e => ({
      _id: e.userId._id,
      name: e.userId.name,
      email: e.userId.email,
      paymentDone: e.paymentDone,
      paymentMethod: e.paymentMethod,
      enrolledAt: e.enrolledAt,
    }));

    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getStudentCategories = async (req, res) => {
    try {
      const students = await StudentUser.find({});
      const enrollments = await Enrollment.find({}).populate('courseId');
  
      // Build map from userId to array of their course prices
      const byUser = {};
      for (const e of enrollments) {
        if (!byUser[e.userId]) byUser[e.userId] = [];
        byUser[e.userId].push(e.courseId ? e.courseId.price : null);
      }
  
      const categories = {
        notEnrolled: [],
        free: [],
        paid: [],
        both: [],
      };
  
      for (const student of students) {
        const prices = byUser[student._id] || [];
        const hasFree = prices.some(p => p === 0);
        const hasPaid = prices.some(p => p > 0);
  
        if (prices.length === 0) categories.notEnrolled.push(student);
        if (hasFree) categories.free.push(student);
        if (hasPaid) categories.paid.push(student);
        if (hasFree && hasPaid) categories.both.push(student);
      }
  
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
