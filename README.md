# 360WorldEducation - Learning Management System

A comprehensive Learning Management System built with Node.js, Express, MongoDB, and Next.js featuring course management,Video and Image Storage in Cloudinary, and student learning portal.

## Demo Video

https://github.com/user-attachments/assets/demo-video.mp4

*Note: All videos used in this project are for educational purposes only.*

## Features

### Admin Dashboard
- **Course Management**: Create, edit, publish, and archive courses
- **Content Upload**: Upload course thumbnails and videos via Cloudinary
- **Section & Video Management**: Organize content into sections with multiple videos
- **Course Status Control**: Draft → Published → Archived workflow
- **Student Analytics**: View enrolled students and course performance
- **Confirmation Dialogs**: Safety prompts for critical actions

### Student Portal
- **Course Catalog**: Browse available courses with modern UI
- **Smart Navigation**: Automatic redirect based on enrollment status
- **Payment Integration**: Razorpay payment gateway for paid courses
- **Learning Interface**: Video player with course progress tracking
- **Enrollment Management**: Seamless enrollment process
- **Responsive Design**: Mobile-friendly interface

### Payment System
- **Razorpay Integration**: Secure payment processing
- **Test Mode Support**: Complete testing with dummy credentials
- **Payment Verification**: Server-side signature validation
- **Free Course Support**: Instant enrollment for free courses

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Cloudinary** for media storage
- **Razorpay** for payment processing
- **JWT** for authentication
- **Multer** for file uploads

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **React Hooks** for state management
- **Responsive Design** principles

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Cloudinary account
- Razorpay account (test mode)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/LearningPlatform
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


4. Start the server:
```bash
npm start
```

### Admin Dashboard Setup

1. Navigate to admin dashboard:
```bash
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Access at: `http://localhost:3000`

### Student Dashboard Setup

1. Navigate to student dashboard:
```bash
cd student-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Access at: `http://localhost:3001`

## API Endpoints

### Admin Routes
- `POST /api/v1/admin/courses` - Create course
- `GET /api/v1/admin/courses` - Get all courses
- `PATCH /api/v1/admin/courses/:id/publish` - Publish course
- `PATCH /api/v1/admin/courses/:id/archive` - Archive course
- `POST /api/v1/admin/courses/:id/sections` - Add section
- `POST /api/v1/admin/sections/:id/videos` - Add video

### Student Routes
- `GET /api/v1/catalog/courses` - Browse courses
- `POST /api/v1/student/enroll` - Enroll in course
- `GET /api/v1/student/enrollments` - Get enrollments
- `POST /api/v1/student/payment/create-order` - Create payment order

## Payme
## Project Structure

```
LearningPlatform/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── config/
├── admin-dashboard/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── utils/
└── student-dashboard/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   └── utils/
```

## Key Features Implementation

### Course Lifecycle Management
- Courses start as "archived" by default
- Admin can publish to make visible to students
- Published courses can be archived to hide
- Confirmation dialogs prevent accidental changes

### Smart Enrollment Flow
- Non-logged users → Login page
- Free courses → Instant enrollment
- Paid courses → Payment gateway
- Already enrolled → Learning page


## Security Features

- JWT-based authentication
- Payment signature verification
- Input validation and sanitization
- CORS configuration
- Environment variable protection


## Future Integrations
## Complete Signed URL try with Amazon S3 bucket signedurl id.
## Restrict Screen Recording
## Complete Payment Gateway Integration

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is for educational purposes only. All videos and content used are for demonstration and learning purposes.

## Support

For support and queries, please create an issue in the repository.

---

**Educational Disclaimer**: All video content and materials used in this project are for educational and demonstration purposes only. No commercial use is intended.