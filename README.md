# StudySync – Group Study Management System

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A clean, responsive, full-stack MERN application built for college practical assessments that allows university students to discover, create, join, and collaborate in peer study circles with real-time capacity management and shared notes.

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

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React, Custom CSS Design System |
| **Backend** | Node.js, Express.js, REST API Architecture, CORS |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing |
| **Tooling** | Concurrently, Nodemon, Dotenv |

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
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
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
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── .env.example
├── package.json                 # Root orchestrator scripts
└── README.md
```

---

## ⚙️ Environment Variables

### 1. Server Environment (`server/.env`)
Create `server/.env` with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/studysync
JWT_SECRET=studysync_jwt_super_secret_key_college_assessment_2026
CLIENT_URL=http://localhost:5173
```
*(For MongoDB Atlas in the cloud, replace `MONGO_URI` with your connection string `mongodb+srv://<user>:<password>@cluster0.mongodb.net/studysync?retryWrites=true&w=majority`)*

### 2. Client Environment (`client/.env`)
Create `client/.env` with:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) account.

### Step 1: Clone or Navigate to Project Root
```bash
cd "MERN DRIVE"
```

### Step 2: Install All Dependencies
You can install dependencies for root, server, and client with:
```bash
npm run install:all
```
*Or install manually:*
```bash
cd server && npm install
cd ../client && npm install
cd ..
```

### Step 3: Populate Demo Seed Data (Optional but Recommended)
Run the seed script to create sample students and active study groups:
```bash
npm run seed
```

### Step 4: Run Application
Start both backend API server and frontend client concurrently:
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

*(On the Login page, you can also click any of the 1-click demo account buttons to auto-fill credentials instantly!)*

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

To verify every requirement during assessment evaluation:

1. **Test Registration & Duplicate Email Protection**:
   - Click **Register** on the navigation bar.
   - Enter `Karan Mehta`, `karan@college.edu`, `password123`, `Computer Science`, `6th Semester`.
   - Submit -> Successfully logged in and redirected to directory.
   - Try to register again with `karan@college.edu` -> Returns error: *"A student with this email address already exists"*.

2. **Test Group Creation & Creator Assignment**:
   - While logged in, click **Create Group**.
   - Fill in:
     - Group Name: `Operating Systems Kernel Study Circle`
     - Subject: `Operating Systems`
     - Description: `Process synchronization, deadlock detection, and virtual memory lab exercises.`
     - Meeting Info: `Every Friday 4:00 PM | Lab Room 404`
     - Max Capacity: `3`
   - Click **Publish Study Group** -> Redirects to Group Workspace.
   - Verify that your account is automatically listed in the Enrolled Members list with role `"Creator"`.

3. **Test Shared Study Notes**:
   - In your newly created group workspace, click **Edit Notes**.
   - Add notes or reference links and click **Save Notes**.
   - Verify notes update immediately with a success message.

4. **Test Joining a Group**:
   - Log out, then log in as `Dev Malhotra` (`dev@college.edu`).
   - Go to Groups Directory and click **Join Group** on `Operating Systems Kernel Study Circle`.
   - Member count increases from 1/3 to 2/3, remaining slots update to 1.

5. **Test Capacity Limit & Full Status**:
   - Log in as another student (`ananya@college.edu`) and join `Operating Systems Kernel Study Circle`.
   - Member count reaches 3/3. Status badge updates to **"Group Full"**.
   - The **Join Group** button is replaced by **"Group Full"** (disabled).
   - If an API request attempts to join, backend responds with `400: Group is full`.

6. **Test Duplicate Join Prevention**:
   - Logged-in member attempts to join a group they are already in -> Blocked on backend with `400: You are already a member of this group`.

---

## 🚢 GitHub Push Instructions

To push this project to a new public GitHub repository:

```bash
# 1. Initialize git in project root (if not already initialized)
git init

# 2. Stage all files (.gitignore automatically protects node_modules and .env)
git add .

# 3. Create initial commit
git commit -m "feat: complete StudySync group study management system (MERN stack)"

# 4. Set default branch to main
git branch -M main

# 5. Add your new GitHub repository remote URL
# (Replace with your actual GitHub repository URL)
git remote add origin https://github.com/<your-username>/studysync-mern.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🌐 Production Deployment Steps

### Option A: Backend on Render / Railway & Frontend on Vercel

#### 1. Deploy MongoDB Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free Shared Cluster (`M0`).
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** -> **Drivers** to get your connection URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/studysync?retryWrites=true&w=majority`.

#### 2. Deploy Backend on [Render](https://render.com)
1. Create a **New Web Service** linked to your GitHub repo.
2. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   - `MONGO_URI`: *<your MongoDB Atlas URI>*
   - `JWT_SECRET`: *<strong random secret string>*
   - `PORT`: `5000`
   - `CLIENT_URL`: *<your production frontend Vercel URL>*
4. Deploy and copy your backend service URL (e.g., `https://studysync-api.onrender.com`).

#### 3. Deploy Frontend on [Vercel](https://vercel.com)
1. Import your GitHub repository in Vercel.
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://studysync-api.onrender.com/api`
5. Click **Deploy**.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
