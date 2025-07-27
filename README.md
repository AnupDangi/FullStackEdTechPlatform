# 360WorldEducation - Learning Management System

A comprehensive Learning Management System built with Node.js, Express, MongoDB, and Next.js featuring course management,Video and Image Storage in Cloudinary, and student learning portal.

*Note: All videos used in this project are for educational purposes only.*


## Screenshots

<img width="1901" height="917" alt="image" src="https://github.com/user-attachments/assets/094b0a0e-77bf-43b7-823f-d4066689678f" />
<img width="1893" height="919" alt="image" src="https://github.com/user-attachments/assets/a4b04823-2b1e-467b-9a30-530df6c61e73" />
<img width="1902" height="921" alt="image" src="https://github.com/user-attachments/assets/9184c2c9-1349-4c82-889a-ed4187d684b6" />
<img width="1902" height="921" alt="image" src="https://github.com/user-attachments/assets/600ef465-0d4f-452d-9ccb-aa994276b669" />
<img width="1889" height="925" alt="image" src="https://github.com/user-attachments/assets/46e8a789-feab-4d5e-94b3-1def05a3ac4a" />
<img width="1878" height="923" alt="6" src="https://github.com/user-attachments/assets/c8456984-6db6-486f-9652-839f5a54b6c0" />
<img width="1902" height="922" alt="7" src="https://github.com/user-attachments/assets/e0ccf99b-44b0-4a7f-ab97-5dd9440753de" />
<img width="1887" height="920" alt="8" src="https://github.com/user-attachments/assets/12916a92-3ea3-4a0d-affd-ef9ced0c9856" />
<img width="1902" height="923" alt="9" src="https://github.com/user-attachments/assets/bcd03b9d-04de-44b8-99bd-31145cd7a8f0" />
<img width="1900" height="919" alt="10" src="https://github.com/user-attachments/assets/3e53801f-5b13-4143-9e6d-a3cfd36d478e" />
<img width="1883" height="922" alt="11" src="https://github.com/user-attachments/assets/15da4c2d-c430-4937-a8b0-441e19b734b3" />
<img width="1884" height="918" alt="12" src="https://github.com/user-attachments/assets/59e4f520-d917-4ff8-8e76-6eecf17b6bf2" />
<img width="1903" height="923" alt="13" src="https://github.com/user-attachments/assets/05f48d40-dba3-4dbf-8d34-3027d04eacf7" />
<img width="1903" height="921" alt="14" src="https://github.com/user-attachments/assets/ccabc283-0d2f-4a01-9deb-d425f4745709" />


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
- **Payment Integration**: Razorpay payment gateway for paid courses (Next Feature)
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
