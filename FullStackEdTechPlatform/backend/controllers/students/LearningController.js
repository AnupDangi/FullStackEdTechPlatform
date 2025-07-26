const Enrollment = require('../../models/students/Enrollment.js');
const Course = require('../../models/admin/Course.js');
const Video = require('../../models/admin/Video.js');
const Section = require('../../models/admin/Section.js');
const cloudinary = require('cloudinary').v2;

// controllers/student/learningController.js
exports.getCourseOutline = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { courseId } = req.params;
  
      // Check enrollment
      const enrolled = await Enrollment.findOne({ userId, courseId, status: 'active' });
      if (!enrolled) return res.status(403).json({ message: "Not enrolled in this course" });
  
      // Return only titles and ids
      const course = await Course.findById(courseId)
        .select('title description instructor sections')
        .populate({
          path: 'sections',
          select: 'title videos',
          populate: {
            path: 'videos',
            select: 'title duration _id'
          }
        });
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      res.json({ course });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.getVideoAccess = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId } = req.params;

    // Find the video, its section, and course
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Find the section that contains this video
    const section = await Section.findOne({ videos: videoId });
    if (!section) return res.status(404).json({ message: "Section not found" });

    // Find the course that contains this section
    const course = await Course.findOne({ sections: section._id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check enrollment (must be active)
    const enrolled = await Enrollment.findOne({ userId, courseId: course._id, status: 'active' });
    if (!enrolled) return res.status(403).json({ message: "Not enrolled in this course" });


    
    // now generate a signed url for the video
    //based on video length generate a signed url for the video
    const EXPIRY_SECONDS=video.duration*2;

    const SAFE_EXPIRY=3600;
    const expiry=EXPIRY_SECONDS>0?EXPIRY_SECONDS:SAFE_EXPIRY;

    const signedUrl=cloudinary.url(video.public_id,{
      resource_type:"video",
      type:"private",
      sign_url:true,
      secure:true,
      expires_at:Math.floor(Date.now()/1000)+expiry,
    });

    res.json({ videoUrl: signedUrl, title: video.title, description: video.description, duration: video.duration });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
