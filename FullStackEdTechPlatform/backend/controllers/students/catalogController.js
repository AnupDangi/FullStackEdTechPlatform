const Course = require('../../models/admin/Course.js');

// List all published courses (public catalog)
exports.listCatalog = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sections (title, description) and for each video: title, description, duration
exports.getCourseSections = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate({
      path: 'sections',
      select: 'title description videos',
      populate: {
        path: 'videos',
        select: 'title description duration'
      }
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    // Format response: only title, description for section, and for each video: title, description, duration
    const sections = course.sections.map(section => ({
      title: section.title,
      description: section.description,
      videos: (section.videos || []).map(video => ({
        title: video.title,
        description: video.description,
        duration: video.duration
      }))
    }));
    res.json({ sections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
