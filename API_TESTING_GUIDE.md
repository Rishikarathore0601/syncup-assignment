# API Testing Guide & Sample Payloads

This guide provides sample payloads and critical instructions for testing the Job Matching Platform API using Swagger or Postman.

## 🚀 Getting Started

1. **Base URL**: `http://localhost:5000/api/v1`
2. **Swagger UI**: `http://localhost:5000/api-docs`
3. **Authentication**: Most endpoints require a Bearer Token.

---

## 🔑 1. Authentication (Public)

### Register User
`POST /auth/register`
- **Roles**: `job_seeker` or `recruiter`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "job_seeker"
}
```

### Login
`POST /auth/login`
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
> [!IMPORTANT]
> Copy the `accessToken` from the response and paste it into the **Authorize** button in Swagger as `bearerAuth`.

---

## 💼 2. Jobs (Recruiter Only)

### Create a Job
`POST /jobs`
```json
{
  "title": "Senior Backend Developer",
  "description": "We are seeking a talented Backend Developer with 5+ years of experience in Node.js, Express, and MongoDB. Must have experience with Redis and Socket.io for real-time features. The candidate should be able to design scalable architectures.",
  "company": {
    "name": "SyncUp Tech"
  },
  "location": "Remote",
  "type": "full_time",
  "experienceLevel": "senior",
  "skills": ["Node.js", "Express", "MongoDB", "Redis", "Socket.io"],
  "salary": {
    "min": 100000,
    "max": 150000
  },
  "deadline": "2026-12-31T23:59:59.000Z"
}
```

---

## 📄 3. Applications (Job Seeker Only)

### Apply to a Job
`POST /applications`
- Get `jobId` from `GET /jobs`
```json
{
  "jobId": "REPLACE_WITH_ACTUAL_ID",
  "resumeUrl": "https://res.cloudinary.com/demo/image/upload/sample_resume.pdf",
  "coverLetter": "I am a perfect match for this role due to my extensive experience in backend systems."
}
```

---

## 🤖 4. AI Features

### Check Match Score
`POST /ai/match-score`
```json
{
  "jobId": "REPLACE_WITH_ACTUAL_ID",
  "resumeUrl": "https://res.cloudinary.com/demo/image/upload/sample_resume.pdf"
}
```

### Extract Skills
`POST /ai/extract-skills`
```json
{
  "resumeUrl": "https://res.cloudinary.com/demo/image/upload/sample_resume.pdf"
}
```

---

## 📌 Points to Remember

1. **Port Conflicts**: If the server fails to start with `EADDRINUSE`, kill the process on port 5000.
2. **Role Restrictions**: 
   - Only `recruiter` can create jobs and view applications for their jobs.
   - Only `job_seeker` can apply to jobs.
3. **Token Expiry**: The `accessToken` is short-lived. Use the `refreshToken` endpoint to get a new one without logging in again.
4. **Valid IDs**: Always ensure the `jobId` or `applicationId` you use exists in your database.
5. **Resume URLs**: For testing, use a valid public URL to a PDF or Word document.
6. **Description Length**: Job descriptions must be at least 50 characters long.
7. **Socket.io**: Real-time notifications are sent to the `recruiter` when a new application is submitted.

---
