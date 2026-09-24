# Namma Voice — Civic Complaint Portal

AI-powered, multilingual civic grievance redressal platform built for INNOVATEX 2026.

Namma Voice lets citizens report civic issues (garbage, water, road, electricity) by voice or text in their own language, automatically classifies and routes each complaint to the right municipal department using AI, and gives staff a real-time dashboard to track and resolve them.

---

## 🚀 Problem Statement

**AI-02: Regional-Language Voice Complaint Summarizer for Civic Bodies**

City helpline offices are flooded with complaints in mixed Hindi/English/regional languages, making it hard to sort and act on them quickly. Namma Voice solves this by converting voice/text complaints into structured, categorized, and routed data for civic staff.

---

## ✨ Features

- 🎤 **Voice input** in 6 languages — English, Hindi, Tamil, Malayalam, Telugu, Kannada (via Web Speech API)
- 🤖 **AI-powered classification** — automatic summary, category, and urgency tagging
- 🏢 **Automatic department routing** — complaints are routed to the correct department (Sanitation, Water Supply, Electricity Board, Public Works, General Administration) based on category
- 🔐 **Real authentication** — citizen and staff accounts with bcrypt password hashing and JWT sessions
- 🛡️ **Role & department-based access control** — staff only see complaints assigned to their own department
- 📊 **Staff dashboard** — filterable by category, urgency, and status, sorted by urgency
- 📍 **Location tagging** and full complaint history per citizen
- 🌐 **Multilingual-first design**, with translation to English planned for cross-department readability

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router (marketing pages) + view-state navigation (app flows)
- Plain CSS
- Web Speech API for voice-to-text

**Backend**
- Node.js + Express
- SQLite (via `better-sqlite3`) — persistent local database
- bcrypt — password hashing
- jsonwebtoken (JWT) — authentication
- dotenv — environment variable management
- LLM API (Claude/Gemini) — summarization, categorization, and translation

---

## 📁 Project Structure

```
NammaVoice/
├── frontend/                  # React app
│   ├── public/
│   │   └── logo.png
│   └── src/
│       ├── components/        # VoiceRecorder, ComplaintForm, ComplaintTable, etc.
│       ├── pages/              # Landing, Auth, Submit, Dashboard, Detail, About, etc.
│       └── api/                 # API client with auth headers
│
├── server/                    # Express backend
│   ├── routes/
│   │   ├── auth.js             # signup / login
│   │   └── complaints.js       # complaint CRUD + department routing
│   ├── auth.middleware.js      # JWT verification + role guard
│   ├── db.js                    # SQLite connection & schema
│   ├── namma_voice.db           # SQLite database file (gitignored)
│   └── .env                     # JWT_SECRET, API keys (gitignored)
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

**users**
| Field | Type | Notes |
|---|---|---|
| id | INTEGER PK | auto-increment |
| role | TEXT | CITIZEN or STAFF |
| name | TEXT | |
| username | TEXT, unique | phone (citizen) or staff ID (staff) |
| password_hash | TEXT | bcrypt hash |
| department | TEXT | null for citizens |
| created_at | DATETIME | |

**complaints**
| Field | Type | Notes |
|---|---|---|
| id | INTEGER PK | auto-increment |
| citizen_id | INTEGER, FK → users.id | |
| original_text | TEXT | |
| language_detected | TEXT | |
| summary | TEXT | |
| category | TEXT | GARBAGE / WATER / ELECTRICITY / ROAD / OTHER |
| department | TEXT | auto-assigned from category |
| urgency | TEXT | LOW / MEDIUM / HIGH |
| status | TEXT | PENDING / IN_PROGRESS / RESOLVED |
| location | TEXT | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

## 🔌 API Endpoints

**Auth**
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |

**Complaints**
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/complaints` | Citizen |
| GET | `/api/complaints/mine` | Citizen |
| GET | `/api/complaints` | Staff (filtered by own department by default) |
| GET | `/api/complaints/:id` | Staff |
| PATCH | `/api/complaints/:id/status` | Staff |

All protected routes require `Authorization: Bearer <token>`.

---

## 🏢 Department Routing

| Category | Department |
|---|---|
| GARBAGE | Sanitation Department |
| WATER | Water Supply Department |
| ELECTRICITY | Electricity Board |
| ROAD | Public Works Department |
| OTHER | General Administration |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Backend setup
```bash
cd server
npm install
# create a .env file with:
# JWT_SECRET=your_secret_here
npm run dev
```
Server runs at `http://localhost:5000`

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 🧪 Testing the Flow

1. Sign up as a citizen and submit a complaint (voice or text)
2. View the AI-generated summary, category, urgency, and department
3. Sign up as staff, selecting a matching department
4. Confirm the complaint appears on that department's dashboard
5. Sign up a second staff account under a different department — confirm it does **not** see the first complaint
6. Update the complaint's status and confirm it reflects correctly

---

## 👥 Team

Built by Team CodeHolic for INNOVATEX 2026, Sathyabama Institute of Science and Technology.

---

## 📄 License

Built for hackathon/educational purposes.
