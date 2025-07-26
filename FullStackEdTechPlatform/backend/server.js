const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinaryConnect = require('./config/admin/cloudinary.js');
const adminCourseRoutes = require('./routes/admin/courseRoutes.js');
const studentRoutes = require('./routes/students/userRoutes.js');
const studentEnrollmentRoutes=require("./routes/students/EnrollmentRoutes.js");
const catalogRoutes = require('./routes/students/catalogRoutes.js');
const studentLearningRoutes=require("./routes/students/learningRoutes.js");
const adminAnalyticsRoutes = require('./routes/admin/analyticsRoutes.js');


dotenv.config();

// Load .env variables
console.log('Loaded environment variables:', {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined
});

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({ origin: ['http://localhost:3000','http://localhost:3001'], credentials: true }));
// app.use(cors());
app.use(express.json());

// Connect DB & Cloudinary
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('DB connected successfully!'))
.catch((err) => console.log('DB connection failed:', err));

cloudinaryConnect();

app.get("/",(req,res)=>{
    res.send("This is the root");
})
// Mount routes
console.log('Course routes loaded:', !!adminCourseRoutes);
app.use('/api/v1/admin', adminCourseRoutes);
app.use('/api/v1/admin/analytics', adminAnalyticsRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/student/auth', studentRoutes);
app.use("/api/v1/student",studentEnrollmentRoutes);
app.use("/api/v1/student/learning",studentLearningRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
