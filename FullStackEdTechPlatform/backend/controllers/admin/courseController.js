const Course = require('../../models/admin/Course.js');
const Section = require('../../models/admin/Section.js');
const Video = require('../../models/admin/Video.js');
const cloudinary=require("cloudinary").v2;


// CREATE COURSE (with thumbnail upload)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructor, price } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Thumbnail image required' });
    const thumbnailUrl = req.file.path;
    const course = await Course.create({
      title, description, instructor, price, thumbnail: thumbnailUrl, status: 'archived'
    });
    res.status(201).json({ success: true, course });
  } catch (err) {
    console.log("Error in creating Course",err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD SECTION TO COURSE
exports.addSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const section = await Section.create({ title });
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { sections: section._id } },
      { new: true }
    );
    res.status(201).json({ success: true, section, course: updatedCourse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD VIDEO TO SECTION (with video upload)
exports.addVideoToSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'No video file uploaded' });
    const video = await Video.create({
      title,
      description,
      videoUrl: req.file.path || req.file.secure_url,
      public_id: req.file.filename || req.file.public_id,
      duration: req.file.duration || 0,
    });
    await Section.findByIdAndUpdate(
      sectionId,
      { $push: { videos: video._id } },
      { new: true }
    );
    res.status(201).json({ success: true, video });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET COURSE DETAILS (deep populate)
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate({
        path: 'sections',
        populate: { path: 'videos' }
      });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL COURSES (list only, no deep populate)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select('-__v').sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE COURSE DETAILS
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, instructor, price, thumbnail } = req.body;
    const updateFields = { title, description, instructor, price };
    if (thumbnail) updateFields.thumbnail = thumbnail;
    const course = await Course.findByIdAndUpdate(courseId, updateFields, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUBLISH COURSE
exports.publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: 'published', publishDate: new Date() },
      { new: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, message: 'Course published', course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ARCHIVE COURSE
exports.archiveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: 'archived' },
      { new: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, message: 'Course archived', course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE COURSE (cascade delete all its sections and videos)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate({ path: 'sections', populate: { path: 'videos' } });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    for (const section of course.sections) {
      for (const videoId of section.videos) {
        await Video.findByIdAndDelete(videoId);
      }
      await Section.findByIdAndDelete(section._id);
    }
    await Course.findByIdAndDelete(courseId);
    res.status(200).json({ success: true, message: 'Course and all related sections/videos deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE SECTION (and all its videos)
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = await Section.findById(sectionId).populate('videos');
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    for (const videoId of section.videos) {
      await Video.findByIdAndDelete(videoId);
    }
    await Section.findByIdAndDelete(sectionId);
    await Course.updateMany({}, { $pull: { sections: sectionId } });
    res.status(200).json({ success: true, message: 'Section and its videos deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE SECTION NAME
exports.updateSectionName = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title } = req.body;
    const updated = await Section.findByIdAndUpdate(sectionId, { title }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, section: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE VIDEO TITLE & DESCRIPTION
exports.updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const updated = await Video.findByIdAndUpdate(videoId, { title, description }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Video not found' });
    res.status(200).json({ success: true, video: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE VIDEO (remove from section and delete video)
exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    // Remove video from all sections
    await Section.updateMany({}, { $pull: { videos: videoId } });
    // Find the video to get its public_id for Cloudinary
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
    // Delete from DB
    await Video.findByIdAndDelete(videoId);
    res.status(200).json({ success: true, message: 'Video deleted from DB and Cloudinary' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};