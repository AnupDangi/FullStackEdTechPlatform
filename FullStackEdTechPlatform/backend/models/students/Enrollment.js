const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentUser", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  enrolledAt: { type: Date, default: Date.now },
  paymentDone: { type: Boolean, default: false },
  paymentMethod: { type: String },     // e.g., 'esewa', 'stripe', 'free'
  paymentRef: { type: String },        // payment gateway transaction ID, or 'free'
  status: { 
    type: String, 
    enum: ['pending', 'active', 'failed', 'refunded'], 
    default: 'pending' 
  }
}, { timestamps: true });

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
