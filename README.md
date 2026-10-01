# StudySync – Group Study Management System

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A clean, responsive, full-stack MERN application built for college practical assessments that allows university students to discover, create, join, and collaborate in peer study circles with real-time capacity management and shared notes.

---

## 🌐 Project Links

- **GitHub Repository**: `[Provide your GitHub Repository URL]`
- **Live Demo (Frontend)**: `[Provide your Deployed Vercel Frontend URL]`
- **Backend API (Render)**: `[Provide your Deployed Render Backend URL]`

---

## 📌 Problem Statement

College students often struggle to organize focused peer study groups across different departments and semesters. Information about subject-specific study circles gets lost in informal chat groups without member limits, schedules, or shared syllabus notes. **StudySync** solves this by providing a unified academic portal where students can browse open groups, respect strict seat limits, collaborate on study notes, and coordinate exam prep sessions effectively.

---

## 🚀 Key Features

1. **Student Authentication & Profiles**:
   - Secure registration with Name, College Email, Department/Branch, Semester, and Password.
   - Duplicate email prevention and JWT-based session security with bcrypt password hashing.
   - Route guard protecting group creation and workspace actions.

2. **Interactive Study Groups Directory**:
   - Dynamic cards showing Subject, Topic description, Meeting schedule/link, and Current vs Max member capacity.
   - Real-time search by keywords, topic, or group title.
   - Filter groups by Subject categories and Status (`Open` vs `Full`).
   - Visual seat capacity progress bar with remaining slots count.

3. **Group Creation & Auto-Leadership**:
   - Authenticated students can create study groups with meeting details and capacity limits ($\ge 2$).
   - Creator is automatically registered as the first member with role `"Creator"`.

4. **Robust Membership & Capacity Enforcement**:
   - Server-enforced business rules preventing duplicate joins and creator re-joins.
   - Capacity limits strictly validated on the backend — automatically toggles status to `Full` and disables join triggers.

5. **Group Workspace & Shared Study Notes**:
   - Comprehensive detail page with enrolled member directory (Name, Department, Semester, Role).
   - Instant 1-click meeting info copy to clipboard.
   - Shared markdown study notes & syllabus area editable by group leaders.

6. **Seed Data & Demo Accounts**:
   - Includes seed script creating 5 demo students and 4 pre-configured study circles across Engineering branches.

---

## 🖼️ User Interface & Screenshots Overview

| View | Description | Key Elements |
|---|---|---|
| **Groups Directory** | Main student discovery hub | Search bar, subject filter tabs, status toggle, capacity progress bar, instant join action |
| **Group Workspace** | Detailed study circle page | Schedule box, 1-click copy meeting info, enrolled members roster, shared notes editor |
| **Create Group** | Group launch form | Subject autocomplete tags, min-capacity validation, creator role auto-assignment |
| **Student Auth** | Login & Register pages | 1-click demo accounts picker, branch & semester dropdowns, client-side validation |

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React, Custom CSS Design System |
| **Backend** | Node.js, Express.js, REST API Architecture, CORS |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Tooling & Deploy** | Concurrently, Nodemon, Dotenv, Vercel (Frontend), Render (Backend), MongoDB Atlas |

---

## 📁 Project Structure

```text
MERN DRIVE/
├── client/                      # React Frontend (Vite)
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # Axios instance & interceptors
│   │   │   └── axios.js
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Alert.jsx
│   │   │   ├── GroupCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/             # Global Auth State
│   │   │   └── AuthContext.jsx
│   │   ├── pages/               # Application Pages
│   │   │   ├── CreateGroup.jsx
│   │   │   ├── GroupDetail.jsx
│   │   │   ├── GroupDirectory.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx              # Routes & Layout
│   │   ├── index.css            # Custom Design System
│   │   └── main.jsx             # React entry point
│   ├── .env.example             # Client env template
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend packages
│   ├── vercel.json              # Vercel SPA rewrite routing rule
│   └── vite.config.js           # Vite configuration
│
├── server/                      # Node.js Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection
│   │   │   └── db.js
│   │   ├── controllers/         # Business logic
│   │   │   ├── authController.js
│   │   │   └── groupController.js
│   │   ├── middleware/          # JWT auth & error handling
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/              # Mongoose Schemas
│   │   │   ├── StudyGroup.js
│   │   │   └── User.js
│   │   ├── routes/              # Express API Routes
│   │   │   ├── authRoutes.js
│   │   │   └── groupRoutes.js
│   │   ├── scripts/             # Database seeder
│   │   │   └── seed.js
│   │   └── server.js            # Express server entry point
│   ├── .env.example             # Server env template
│   └── package.json             # Backend packages
│
├── .gitignore                   # Excludes node_modules and all .env files
├── .env.example                 # Root environment template
├── package.json                 # Root orchestrator scripts
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables

### 1. Server Environment (`server/.env`)
Create `server/.env` with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/studysync
JWT_SECRET=studysync_jwt_super_secret_key_college_assessment_2026
CLIENT_URL=http://localhost:5173
```
*(For cloud production deployment, replace `MONGO_URI` with your MongoDB Atlas URI and `CLIENT_URL` with your Vercel URL)*

### 2. Client Environment (`client/.env`)
Create `client/.env` with:
```env
VITE_API_URL=http://localhost:5000/api
```
*(For cloud production deployment, replace `VITE_API_URL` with your Render backend URL e.g. `https://studysync-api.onrender.com/api`)*

---

## 💻 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster.

### Step 1: Clone or Navigate to Project Root
```bash
cd "MERN DRIVE"
```

### Step 2: Install All Dependencies
```bash
npm run install:all
```

### Step 3: Populate Demo Seed Data (Optional)
```bash
npm run seed
```

### Step 4: Run Application
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Test Credentials

All demo accounts share the password: `password123`

| Name | Email | Department | Semester |
|---|---|---|---|
| Aarav Sharma | `aarav@college.edu` | Computer Science & Engineering | 6th Semester |
| Priya Patel | `priya@college.edu` | Information Technology | 6th Semester |
| Rohan Verma | `rohan@college.edu` | AI & Data Science | 4th Semester |
| Ananya Iyer | `ananya@college.edu` | Electronics & Communication | 4th Semester |
| Dev Malhotra | `dev@college.edu` | Computer Science & Engineering | 8th Semester |

*(The login page includes 1-click demo credential selector buttons!)*

---

## 📡 REST API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student with name, email, password, dept, semester |
| `POST` | `/api/auth/login` | Public | Authenticate student and return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current student profile |

### Study Group Endpoints (`/api/groups`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/groups` | Public | List all groups (Supports `?search=`, `?subject=`, `?status=`) |
| `GET` | `/api/groups/:id` | Public | Get single study group with populated members and creator |
| `POST` | `/api/groups` | Private | Create new group (creator is auto-assigned as Lead member) |
| `POST` | `/api/groups/:id/join` | Private | Join an open study group (enforces capacity & duplicate checks) |
| `PUT` | `/api/groups/:id/notes` | Private | Update shared study notes / syllabus |
| `POST` | `/api/groups/:id/leave` | Private | Leave study group (regular members only) |
| `DELETE` | `/api/groups/:id` | Private | Delete study group (Creator only) |

---

## 🧪 Comprehensive End-to-End Test Flow

1. **Test Registration & Duplicate Email Protection**:
   - Go to [http://localhost:5173/register](http://localhost:5173/register).
   - Enter student details and submit -> Successful registration and auto login.
   - Attempt registering again with same email -> Blocked with duplicate email warning.

2. **Test Group Creation & Creator Assignment**:
   - While logged in, click **Create Group**.
   - Enter Group Name, Subject, Description, Meeting Info, and Max Capacity $\ge 2$.
   - Submit -> Created successfully, redirected to Workspace with you as **Lead Creator**.

3. **Test Shared Study Notes**:
   - In Workspace, click **Edit Notes**, add revision bullet points, click **Save Notes**.
   - Notes persist in MongoDB and display formatted for all members.

4. **Test Joining an Open Group**:
   - Log in as another student (e.g. `rohan@college.edu`).
   - Click **Join Group** on the directory card or workspace.
   - Member count updates dynamically.

5. **Test Capacity Limit & Full Status**:
   - When member count reaches capacity, status switches to **"Group Full"**.
   - The Join button is disabled and backend rejects new joins with `400: Group is full`.

6. **Test Duplicate Join Prevention**:
   - An enrolled student attempting to re-join is rejected with `400: You are already a member of this group`.

---

## 🚢 GitHub Push Instructions

```bash
git init
git add .
git commit -m "Initial StudySync application"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

---

## 🌐 Production Deployment Steps

### 1. Database (MongoDB Atlas)
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Database User and allow Network Access from anywhere (`0.0.0.0/0`).
3. Copy your URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/studysync?retryWrites=true&w=majority`.

### 2. Backend (Render)
1. Create a **New Web Service** linked to your GitHub repo.
2. Root Directory: `server`, Build Command: `npm install`, Start Command: `npm start`.
3. Add Environment Variables:
   - `MONGO_URI`: *<your MongoDB Atlas URI>*
   - `JWT_SECRET`: *<your secure secret string>*
   - `PORT`: `5000`
   - `CLIENT_URL`: *<your Vercel frontend URL>*

### 3. Frontend (Vercel)
1. Import repository in [Vercel](https://vercel.com).
2. Root Directory: `client`, Framework Preset: `Vite`.
3. Add Environment Variable:
   - `VITE_API_URL`: `<your Render backend URL>/api`
4. Deploy!

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
