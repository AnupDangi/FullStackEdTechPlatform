const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },                // 0 for free, >0 for paid
    thumbnail: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }, // NEW
    publishDate: Date,                                      // NEW
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
