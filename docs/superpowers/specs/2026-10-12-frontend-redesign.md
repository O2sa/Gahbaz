# Frontend Modernization & UX Redesign Specification

**Date:** 2026-10-12  
**Feature:** Complete Modernization, Redesign & UX Elevation of Gahbaz Learning Platform  
**Target:** Client Web Application (`client/`)

---

## 1. Overview & Vision
Gahbaz (منصة جهبذ) is an academic learning and institutional management platform built with React 18, Vite, and Mantine v6 with native Arabic RTL support. This specification outlines a comprehensive visual and user-experience overhaul to elevate the platform to a modern, world-class Academic SaaS application.

### Key Goals:
1. **Modern Academic SaaS Aesthetic**: Rich deep indigo/royal navy palette (`#1E40AF` / `#3B82F6`), soft glassmorphic elevations, clean Cairo typography, subtle micro-interactions, and refined card borders.
2. **Seamless Dark / Light Mode**: Unified dynamic theme toggle with local storage persistence and cohesive color tokens across every surface, input, card, and modal.
3. **Elevated AppShell & Navigation**: Ergonomic glass header with dark mode toggle, notifications, and user role badges; collapsible grouped sidebar with glow pills for active items; integrated breadcrumbs.
4. **High-Impact Landing & Split Auth Experience**: A stunning Arabic EdTech landing page with hero metrics, interactive feature showcase, and a split-screen authentication suite with quick test credentials.
5. **Polished Role Dashboards & DataTables**: Role-specific workspaces for Admin, Teacher, and Student with real-time health charts, intuitive stat cards, debounced search tables, and confirmation modals.

---

## 2. Design System & Theme Architecture

### 2.1 Theme Tokens (`client/src/theme/`)
- **Primary Color Scale (`brand`)**:
  - `brand[0]`: `#eff6ff` (light surface tint)
  - `brand[1]`: `#dbeafe`
  - `brand[2]`: `#bfdbfe`
  - `brand[3]`: `#93c5fd`
  - `brand[4]`: `#60a5fa`
  - `brand[5]`: `#3b82f6` (dark mode primary accent)
  - `brand[6]`: `#2563eb`
  - `brand[7]`: `#1d4ed8` (light mode primary accent)
  - `brand[8]`: `#1e40af` (deep navy primary)
  - `brand[9]`: `#1e3a8a` (darkest navy)
- **Semantic Accents**:
  - Success/Grades: Emerald (`#10B981` / `#34D399`)
  - Warning/Pending: Amber (`#F59E0B`)
  - Danger/Destructive: Rose (`#EF4444`)
  - Informational: Sky (`#0EA5E9`)
- **Typography**:
  - Font Family: `'Cairo', system-ui, -apple-system, sans-serif`
  - Heading 1: 28px, weight 700, line-height 1.3
  - Heading 2: 22px, weight 600, line-height 1.35
  - Heading 3: 18px, weight 600, line-height 1.4
  - Body Text: 14px, weight 400/500, line-height 1.6
  - Caption / Badges: 12px, weight 600
- **Surface & Glass Tokens**:
  - Border Radius: `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 24px`
  - Light Paper Background: `#FFFFFF`, border `#E2E8F0`, surface `#F8FAFC`
  - Dark Paper Background: `#1E293B`, border `#334155`, surface `#0B1120`
  - Header Glass Effect: `rgba(255, 255, 255, 0.85)` in light, `rgba(15, 23, 42, 0.85)` in dark, with `backdrop-filter: blur(12px)`

### 2.2 Global App Theme Provider (`client/src/App.jsx`)
- Wrapped in Mantine's `ColorSchemeProvider` with `useLocalStorage({ key: 'gahbaz-color-scheme', defaultValue: 'light' })`.
- Mantine `MantineProvider` dynamically provides `colorScheme`, `theme`, and `emotionCache={rtlCache}`.

---

## 3. AppShell & Navigation Architecture

### 3.1 AppHeader (`client/src/layouts/AppHeader.jsx`)
- Fixed sticky glassmorphic topbar with height `64px`.
- Left (RTL Start): Platform Brand Logo + "منصة جهبذ" with subtle badge.
- Center/Right:
  - Mobile hamburger toggle for the responsive sidebar drawer.
  - Dark / Light Mode Toggle Button with animated sun/moon icon.
  - Notifications Bell icon button with ping indicator badge.
  - User Menu (`UserMenu.jsx`): Avatar, full name, role badge (`مدير نظام` / `معلم` / `طالب`), and dropdown with profile links and logout button.

### 3.2 AppNavbar (`client/src/layouts/AppNavbar.jsx`)
- Width `270px` (or collapsible rail on desktop toggle).
- Grouped navigation links with category section titles:
  - **الرئيسية**: لوحة التحكم (`/`)
  - **الإدارة الأكاديمية**: الكليات (`/collages`)، التخصصات (`/majors`)، المواد (`/subjects`)، الفصول (`/semesters`)، قوالب الفصول (`/semesters-templates`)، المقررات (`/courses`)
  - **إدارة المستخدمين**: المدراء (`/admins`)، المعلمون (`/teachers`)، الطلاب (`/students`)
  - **التواصل**: المحادثات (`/chat`)
- Active link styling: Soft background tint (`brand[0]` in light, `brand[9]` in dark), bold text, and primary color icon.

### 3.3 RootLayout & Breadcrumbs (`client/src/layouts/RootLayout.jsx`)
- Maintains breadcrumb path hierarchy below the header.
- Synchronizes page document titles via `react-helmet`.

---

## 4. Landing Page & Authentication Redesign

### 4.1 Modern Landing Page (`client/src/pages/public/Landing.jsx`)
- **Sticky Glass Navbar**: Logo, feature anchor links (الميزات، لوحات التحكم، عن المنصة)، and login button.
- **Hero Banner**:
  - Bold, impactful Arabic headline and subheadline highlighting institutional efficiency and interactive learning.
  - Call-to-actions: Primary "تسجيل الدخول / ابدأ الآن" and secondary "استكشف المقررات".
  - Floating metric chips: Active colleges, student count, and real-time interactive badges.
- **Features Section**:
  - 4 glassmorphic feature cards with Tabler icons and gradient badges (Academic Hierarchy, Video & Rich Text Lessons, Grade Portal, Real-time Chat).
- **Interactive Role Showcase**:
  - Segmented control / Tab preview illustrating the interface for Admin, Teacher, and Student.
- **Footer**:
  - Brand identity, contact links, copyright, and platform metadata.

### 4.2 Split-Screen Authentication (`Login.jsx` & `Register.jsx`)
- Two-column split layout:
  - **Visual Brand Panel**: Deep indigo royal gradient, platform imagery/illustrations, inspiring academic quote, and quick value propositions.
  - **Form Area Panel**: High-contrast card, `TextInput`, `PasswordInput` with visibility toggle, remember me checkbox, and submit button with loading spinner.
- **One-Click Quick Login Credentials**:
  - Three quick-fill buttons for demo/testing convenience:
    - *مدير (Admin)*: `admin@gmail.com`
    - *معلم (Teacher)*: `teacher@gmail.com`
    - *طالب (Student)*: `student@gmail.com`

---

## 5. Dashboards & Academic Management Pages

### 5.1 Role Dashboards
- **Admin Dashboard (`admin/Dashboard.jsx`)**:
  - Welcome banner with greeting and active academic period info.
  - 4 KPI StatCards (`الكليات النشطة`, `إجمالي الطلاب`, `أعضاء هيئة التدريس`, `المقررات`) with trend badges.
  - Real-time System Monitor: CPU Usage, Memory Usage, and Network I/O line charts with themed gridlines.
  - Quick action shortcut buttons to add academic entities.
- **Teacher Dashboard (`teacher/Dashboard.jsx`)**:
  - My Courses overview with active students and lesson progress bars.
  - Quick grading and syllabus review shortcuts.
- **Student Dashboard (`student/Dashboard.jsx`)**:
  - Current semester status, active enrolled courses with resume buttons, and latest GPA summary.

### 5.2 Standardized DataTables & Modals
- **DataTable Component (`client/src/components/common/DataTable.jsx`)**:
  - Debounced search input (350ms delay).
  - Page size selector (10, 25, 50 rows).
  - Row hover effects with subtle border contrast.
  - Clean pagination controls and total record indicators.
  - Built-in `EmptyState` when records are zero or search returns no results.
- **Modals (`ConfirmModal.jsx` and CRUD Dialogs)**:
  - Centered modals with smooth scale transition.
  - Full Mantine Form validation with live error indicators.
  - Safe confirmation modal before destructive operations.

---

## 6. Verification & Quality Gates
- **Production Build**: `pnpm run build` in `client/` must succeed with exit code 0.
- **Backend Tests**: `pnpm test` in `backend/` must stay 100% green (15/15 files, 66/66 tests).
- **Browser Testing**: Verified via browser subagent across Light and Dark modes on all primary routes (`/`, `/login`, `/collages`, `/dashboard`).
