# Gahbaz (منصة جَهْبَذ) — Academic Management & E-Learning System

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-gahbaz.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://gahbaz.netlify.app/)
[![API Status](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://elearningsystem.onrender.com/health)
[![API Docs](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://elearningsystem.onrender.com/api/docs)
[![Tests Passing](https://img.shields.io/badge/Vitest-141%20Passed%20(100%25)-green?style=for-the-badge&logo=vitest&logoColor=white)](#testing--quality-assurance)

<br/>

[![Preview Screenshot](screenshot.png)](https://gahbaz.netlify.app/)

<p align="center">
  <strong>An integrated, enterprise-grade academic management and e-learning platform engineered for modern universities, colleges, and higher-education institutions.</strong>
</p>

[العربية (Arabic Documentation)](README.ar.md) • [System Architecture](docs/ARCHITECTURE.md) • [Deployment Guide](docs/DEPLOYMENT.md) • [API Reference](docs/API.md)

</div>

---

## 🌟 Highlights & Key Capabilities

- **Institutional Academic Hierarchy**: Full governance of universities, colleges, academic departments, majors, degree curricula, master subjects catalog, and semester templates.
- **Automated Semester Rollout Wizard**: Multi-tier course generation, faculty assignment, and syllabus instantiation wrapped in **atomic MongoDB transaction sessions** with automatic rollback on error.
- **Continuous Assessment & Faculty Gradebook**: Granular assessment breakdown (Midterms, Quizzes, Projects, Final Exams) with live telemetry and strict maximum score validations.
- **Student Course Enrollment & Add/Drop Portal**: Self-service portal enforcing credit-hour limits, prerequisite checks, and real-time Socket.IO roster synchronization.
- **Official Printable Transcripts & Cumulative GPA**: Grade Point Average calculations following university grading scales (A+, A, B+, B, C+, C, D+, D, F) with printable transcripts.
- **Real-Time Course Channels & Chat**: Instant bidirectional communication powered by Socket.IO with deep-linking, typing telemetry, and automatic course enrollment membership synchronization.
- **Course Assignments & Student Submissions Hub**: Homework publication with file attachments, student submission portal, and teacher grading workflows.
- **Pluggable Storage Subsystem**: Driver abstraction supporting **Wasabi Hot Cloud Storage (S3)**, **Amazon S3**, **Cloudinary**, and local disk storage.
- **Anti-Flash Theme Engine**: System-aware Dark and Light modes with zero-delay pre-hydration `<script>`, eliminating initial paint flash.
- **Non-Blocking Arabic EdTech Experience**: Instant landing page loading with non-blocking session queries and native Arabic RTL typography using Google's **Cairo** font.
- **Strict User Naming & Credentialing**: Structured 3-part / 4-part Arabic name validation with automated temporary password generation for physical/electronic distribution.

---

## ⚡ Quick Demo Accounts

The live demo at **[gahbaz.netlify.app](https://gahbaz.netlify.app/)** comes pre-seeded with full institutional demo data:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@gmail.com` | `admin123` | Institutional hierarchy, semester launch wizard, user directories, global settings |
| **Faculty / Teacher** | `faisal.shammari@teacher.test` | `teacher123` | Courseware, lessons, video streaming, assignments grading, faculty gradebook, chat |
| **Student** | `sara.ahmed@student.test` | `student123` | Course enrollment, lecture player, assignment submission, transcript, course chat |

---

## 🛠️ Technology Stack

### Frontend Application (`client/`)
- **Core**: React 18 (Single Page Application), Vite 5
- **UI & Layout**: [Mantine UI v6](https://mantine.dev), Mantine React Table, Tabler Icons
- **Typography & Direction**: Native Arabic RTL with Cairo font and Emotion RTL cache (`stylis-plugin-rtl`)
- **State & Server Synchronization**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Real-Time Client**: Socket.IO Client 4.x
- **Deployment**: [Netlify Edge CDN](https://gahbaz.netlify.app/) with SPA routing rewrites

### Backend API & Real-Time Engine (`backend/`)
- **Runtime & Framework**: Node.js (ES Modules), Express.js
- **Database & Transactions**: MongoDB 7.x, Mongoose 8.x with multi-document ACID transactions
- **Real-Time Layer**: Socket.IO 4.x (namespaced course channels, direct rooms, roster sync)
- **Security & RBAC**: JWT (HTTP-Only cookies + Bearer auth), Helmet, Express Rate Limit, Mongo Sanitize
- **Storage Subsystem**: AWS SDK v3 for S3 / Wasabi presigned URLs, Cloudinary v2, Local Disk Driver
- **Documentation**: Swagger UI Express, OpenAPI 3.0 specification
- **Deployment**: [Render Web Service](https://render.com/)

---

## 📁 Repository Structure

```
Gahbaz/
├── backend/                        # Node.js Express REST & Socket.IO server
│   ├── src/
│   │   ├── core/                   # Middleware, error hierarchy, security utils
│   │   ├── modules/                # Domain-driven modular services
│   │   │   ├── auth/               # Authentication & token management
│   │   │   ├── users/              # Unified user directory & credentials
│   │   │   ├── colleges/           # Institutional colleges management
│   │   │   ├── majors/             # Academic majors & curricula
│   │   │   ├── subjects/           # Master catalog of academic subjects
│   │   │   ├── semesters/          # Semesters & atomic launch transactions
│   │   │   ├── courses/            # Course offerings, sections, and lessons
│   │   │   ├── assignments/        # Course assignments & student submissions
│   │   │   ├── enrollment/         # Student self-service add/drop portal
│   │   │   ├── grades/             # Continuous assessment & faculty gradebook
│   │   │   ├── transcripts/        # Official transcripts & cumulative GPA
│   │   │   ├── chat/               # Real-time chat & roster synchronization
│   │   │   └── media/              # Media upload, presigned URLs, streaming
│   │   ├── services/storage/       # Multi-driver storage subsystem (S3/Wasabi/Cloudinary)
│   │   └── docs/                   # OpenAPI / Swagger definition
│   └── tests/                      # Comprehensive Vitest test suites (141 tests)
├── client/                         # Modern React 18 + Mantine UI frontend
│   ├── src/
│   │   ├── api/                    # Centralized Axios client & domain API services
│   │   ├── chat/                   # Real-time chat interface & message drawer
│   │   ├── components/             # Reusable UI components (DataTable, StatCards, Modals)
│   │   ├── layouts/                # Mantine AppShell, Header, Navbar, UserMenu
│   │   ├── pages/                  # Public, Student, Teacher, and Admin views
│   │   ├── theme/                  # Theme tokens, Cairo font, and RTL cache
│   │   └── routes.jsx              # Pathless layout architecture & route definitions
│   └── public/                     # Static assets and Netlify SPA _redirects
├── docs/                           # Technical documentation, specs, and execution plans
│   ├── ARCHITECTURE.md             # In-depth architectural specification
│   ├── DEPLOYMENT.md               # Decoupled Netlify + Render deployment guide
│   ├── API.md                      # REST endpoints and WebSocket events reference
│   └── superpowers/                # Feature specifications and implementation plans
├── netlify.toml                    # Netlify production build & redirect configuration
└── render.yaml                     # Render Infrastructure-as-Code service blueprint
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [pnpm](https://pnpm.io/) (or `npm`)
- [MongoDB](https://www.mongodb.com/) (v6+ replica set required for multi-document transaction support)

### 1. Clone the Repository
```bash
git clone https://github.com/O2sa/Gahbaz.git
cd Gahbaz
```

### 2. Configure Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/gahbaz?replicaSet=rs0
JWT_SECRET=super_secret_jwt_key_gahbaz_2026
JWT_LIFETIME=7d
CLIENT_URL=http://localhost:5173

# Storage configuration (choose: s3, cloudinary, or local)
STORAGE_PROVIDER=local
UPLOAD_DIR=uploads
```

Create `.env` in `client/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Install Dependencies & Seed Demo Data
```bash
# Install backend dependencies
cd backend && pnpm install

# Install frontend dependencies
cd ../client && pnpm install

# Seed complete institutional demo data (from backend directory)
cd ../backend && pnpm seed
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend API (http://localhost:5000)
cd backend && pnpm dev

# Terminal 2: Frontend Client (http://localhost:5173)
cd client && pnpm start
```

Visit **`http://localhost:5173/`** to explore the platform.

---

## 🧪 Testing & Quality Assurance

Gahbaz incorporates an automated test suite powered by **Vitest** covering tenant isolation, semester rollout transactions, assessment math, add/drop limits, and storage drivers:

```bash
cd backend
pnpm test
```

```
Test Files  34 passed (34)
     Tests  141 passed (141)
  Duration  ~13.2s
```

All 141 integration and unit tests pass with zero warnings.

---

## 🌐 Production Deployment

Gahbaz is architected for decoupled cloud deployment:
- **Frontend on Netlify**: Continuous deployment from `main` branch with `publish = "client/dist"`. Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.
- **Backend on Render**: Provisioned via the checked-in `render.yaml` blueprint with health check probes at `/health`.

---

## 📖 Additional Documentation

- [System Architecture & In-Depth Design](docs/ARCHITECTURE.md)
- [Production Deployment Handbook](docs/DEPLOYMENT.md)
- [API Reference & OpenAPI Guide](docs/API.md)
- [الوثائق باللغة العربية (Arabic)](README.ar.md)

---

## 📄 License & Maintainers

This project is licensed under the **ISC License**. Developed with dedication by **[Osama Mabkhout](https://github.com/O2sa)** and the Gahbaz Engineering Team.
