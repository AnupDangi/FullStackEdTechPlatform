const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    videoUrl: { type: String, required: true },
    public_id: { type: String, required: true },
    duration: Number,
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
