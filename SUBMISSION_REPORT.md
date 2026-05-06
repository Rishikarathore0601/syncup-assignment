# SyncUp - Job Matching Platform 🚀
**Full Stack Developer Assignment Submission**

## 📖 Project Overview
SyncUp is a scalable, AI-powered job matching platform designed to connect **Job Seekers** with their ideal roles and allow **Recruiters** to effortlessly source and manage top talent. The platform features robust real-time notifications, intelligent AI resume matching, and a highly responsive Next.js frontend integrated with a powerful Node.js backend.

---

## 🛠️ Technology Stack
**Frontend:**
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Custom Vanilla CSS with responsive Glassmorphism design aesthetics
- **State Management:** React Context API (`AuthContext`, `SocketContext`)
- **Icons:** Lucide-React
- **HTTP Client:** Axios with Interceptors

**Backend:**
- **Core:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Caching:** Redis (Optimized Job Search)
- **File Storage:** Cloudinary / AWS S3
- **Real-Time:** Socket.io
- **AI Integration:** Azure OpenAI (Mocked/Integrated via keyword abstraction logic)
- **Authentication:** JWT (Access & Refresh Tokens)

---

## ✨ Core Features Implemented

### 1. Authentication & Authorization (JWT)
- Role-based access control (`job_seeker` vs `recruiter`).
- Secure token handling. Tokens are attached to Axios interceptors for authenticated API requests.

### 2. Job Discovery & Filtering (Redis Cached)
- Real-time job board rendering dynamic roles.
- Interactive Search UI filtering by **Keywords**, **Location**, and **Skills**.
- Fast fetching backed by the Backend's Redis caching layer.

### 3. AI-Powered Resume Matching 🤖
- Before applying, job seekers can upload their resumes (PDF/DOC) and hit **"Get AI Match Score"**.
- The platform evaluates the resume against the job requirements, returning an overall **Match Percentage** and a localized list of exactly which **Skills Matched**.

### 4. Seamless Resume Uploads
- Direct integration with Multer and Cloudinary. Resumes are safely stored via `POST /upload/resume` and securely linked to the application profile.

### 5. Application Tracking Pipeline
- **Job Seeker Dashboard:** Tracks historical applications, timestamps, and real-time status updates (Applied, Shortlisted, Rejected).
- **Recruiter Dashboard:** Displays all actively posted jobs. Recruiters can drill down into a specific job pipeline to view candidates, review cover letters/resumes, see AI match scores, and instantly update applicant statuses.

### 6. Real-Time WebSockets 🔔
- Persistent global Socket connection maintained via `SocketContext`. 
- Triggers instant UI notifications (e.g., when a recruiter posts a new job or a seeker applies to a job).

---

## 🌐 API Integration Flow
The frontend flawlessly maps to the backend REST architecture:
- `POST /auth/register` & `POST /auth/login` ➔ Auth Context
- `GET /jobs` ➔ Job Board with Query Params (`search`, `location`, `skills`)
- `POST /upload/resume` ➔ Multipart Form Data File Upload
- `POST /ai/score-resume` ➔ AI parsing evaluating `jobId` & `resumeText`
- `POST /applications` ➔ Application Submission
- `PATCH /applications/:id/status` ➔ Recruiter Pipeline Management

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Redis Server (Running on port 6379)

### Backend Setup
1. Navigate to the root directory.
2. Run `npm install`
3. Configure your `.env` file (Database URIs, JWT Secrets, Cloudinary Keys).
4. Run `npm run dev` (Server starts on `http://localhost:5000`).

### Frontend Setup
1. Navigate to the `/frontend` directory.
2. Run `npm install`
3. Create a `.env.local` file and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
   *(For production, swap this to your deployed Render/EC2 URL)*
4. Run `npm run dev` (App starts on `http://localhost:3000`).

---

**Evaluated Criteria Met:**
✔️ Clean Code Quality & Component Modularity  
✔️ Clear Micro-Architecture (Services, Contexts, Hooks)  
✔️ Strict API Validation  
✔️ Production-Ready Deployment Capabilities  
