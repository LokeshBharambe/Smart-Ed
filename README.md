# 🎓 Smart-ED — AI-Powered Learning Platform

A full-stack web app with Node.js/Express backend and vanilla JS frontend.

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd backend && npm install && cd ..

# 2. Start the server
node backend/server.js

# OR use the start script
bash start.sh
```

Open **http://localhost:3001** in your browser.

---

## 🔑 Demo Accounts

| Role    | Email                | Password |
|---------|----------------------|----------|
| Student | student@demo.com     | demo123  |
| Teacher | teacher@demo.com     | demo123  |

---

## ✨ Features

### Student
- **Dashboard** — streak, XP, subject progress bars, AI-recommended quizzes
- **Quizzes** — timed interactive quizzes with instant scoring & answer review
- **Materials** — study resources grouped by subject
- **Profile** — level, XP bar, quiz history, activity feed

### Teacher
- **Overview** — class stats, subject averages, student count
- **Students** — per-student scores, progress bars, XP & streak
- **Announcements** — post class-wide notices
- **Materials** — manage study resources

---

## 🗂 Project Structure

```
smart-ed/
├── backend/
│   ├── server.js       # Express API (auth, dashboard, quizzes, etc.)
│   ├── db.json         # Auto-created JSON database (on first run)
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── css/main.css
│   └── js/
│       ├── api.js          # Fetch wrapper
│       ├── auth.js         # Token management
│       ├── router.js       # Client-side routing
│       ├── components.js   # Shell, toast, helpers
│       └── pages/
│           ├── login.js
│           ├── dashboard.js
│           ├── quizzes.js
│           ├── quiz-play.js
│           ├── materials.js
│           ├── students.js
│           └── profile.js
└── start.sh
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/dashboard` | Dashboard data |
| GET | `/api/quizzes` | List quizzes |
| GET | `/api/quizzes/:id` | Quiz with questions |
| POST | `/api/quizzes/:id/submit` | Submit answers, get score |
| GET | `/api/materials` | Study materials |
| GET | `/api/announcements` | Announcements |
| POST | `/api/announcements` | Post announcement (teacher) |
| GET | `/api/students` | All students (teacher) |
| GET | `/api/profile` | Current user profile |

---

Built by Lokesh Bharambe 
