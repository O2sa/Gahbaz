# Frontend Modernization & Architectural Design Specification

- **Project:** Gahbaz E-Learning & Administration Platform
- **Date:** 2026-10-12
- **Status:** Approved
- **Scope:** Complete frontend refactoring, component library consolidation (Mantine UI), data layer modernization (TanStack React Query v5), and backend API contract alignment.

---

## 1. Executive Summary & Goals

### 1.1 Context
The Gahbaz backend has recently undergone a major refactor:
- Monolithic controllers decomposed into 13 modular domains under `backend/src/modules/`.
- Full OpenAPI 3.0.3 specification and interactive Swagger UI.
- Centralized pagination (`sendPaginated`) standardized across all listing endpoints returning `{ success: true, data: [...], meta: { page, limit, total, totalPages } }`.

The client application (`client/`) currently contains legacy code, mixed styling frameworks (CoreUI / Bootstrap + Mantine v6 + styled-components + Emotion), an ad-hoc generic CRUD utility (`crud.js`), and lingering MirageJS mock servers (`fake_db.json`, `server.js`).

### 1.2 Core Objectives
1. **Consolidate on Mantine UI:** Completely phase out `@coreui/*`, Bootstrap classes, and legacy SCSS. Standardize all layout and UI components on Mantine v6.
2. **Arabic RTL First Design:** Deliver a modern, high-contrast, bilingual design with native Arabic RTL support using Google Font **Cairo**, customized color palettes, and glassmorphism touches.
3. **Connect to Live Backend:** Eliminate MirageJS mocks. Connect directly to `http://localhost:5000/api/v1` with Vite proxy support.
4. **Data Layer Modernization:** Introduce TanStack React Query v5 with modular, typed API service clients supporting server-side pagination, search debouncing, and cache invalidation.
5. **Reusable Component Architecture:** Build standardized building blocks (`DataTable` with pagination, `PageHeader`, `StatCard`, `EmptyState`, `ConfirmModal`).

---

## 2. Architecture & Directory Structure

The `client/src` directory is organized into distinct, single-responsibility modules:

```
client/src/
├── api/                   # Centralized API client & domain services
│   ├── client.js          # Axios instance with auth interceptors & response unwrapper
│   ├── auth.api.js        # Auth endpoints (login, logout, currentUser)
│   ├── colleges.api.js    # Colleges endpoints with pagination & search
│   ├── majors.api.js      # Majors & department endpoints
│   ├── semesters.api.js   # Semesters, templates & academic cycles
│   ├── subjects.api.js    # Subjects & course catalog
│   ├── students.api.js    # Students listing, grades & enrollments
│   ├── teachers.api.js    # Teachers & staff management
│   ├── admins.api.js      # Admins management & privileges
│   └── auditLogs.api.js   # Audit logs with date & user filters
├── theme/                 # Mantine theme configuration & styling tokens
│   ├── index.js           # Theme definition (colors, fonts, radius, components)
│   └── rtlCache.js        # Emotion RTL cache with stylis-plugin-rtl
├── layouts/               # Mantine AppShell layouts
│   ├── MainLayout.jsx     # Mantine AppShell wrapper with responsive header & sidebar
│   ├── AppHeader.jsx      # Top bar (brand, search, theme toggle, notifications, user menu)
│   ├── AppNavbar.jsx      # Sidebar navigation with role-based filtering
│   └── UserMenu.jsx       # Avatar popover with profile and logout actions
├── components/            # Reusable UI primitives
│   ├── common/
│   │   ├── DataTable.jsx  # Mantine Table with pagination controls, page size, search
│   │   ├── PageHeader.jsx # Title, breadcrumbs, action button group
│   │   ├── StatCard.jsx   # Metrics KPI card with icons & trends
│   │   ├── EmptyState.jsx # Visual empty state placeholder
│   │   └── ConfirmModal.jsx # Reusable deletion/action confirmation modal
│   └── index.js
├── features/              # Feature-specific components and sub-views
│   ├── auth/              # Login, register, forgot-password views
│   ├── colleges/          # College list, add modal, edit drawer, details view
│   ├── semesters/         # Semester template & active semester management
│   ├── students/          # Student directory, gradebook, profile view
│   └── ...
├── hooks/                 # Custom reusable hooks
│   ├── useAuth.js         # Authentication state, session, and role helpers
│   ├── usePagination.js   # URL-synchronized or local pagination state
│   └── useDebounce.js     # Input debounce utility
├── pages/                 # Route entrypoints (Admin, Teacher, Student, Public)
├── routes/                # Route definitions with role-based Route Guards
│   └── index.jsx
├── App.jsx                # App wrapper with MantineProvider, QueryClientProvider, Router
└── main.jsx               # Vite root entrypoint
```

### Cleanup Plan:
- **Files to Remove:**
  - `src/server.js` (MirageJS mock server)
  - `src/fake_db.json` (Mock data file)
  - `src/pages/crud.js` (Ad-hoc array URL joiner)
  - `src/scss/` (CoreUI / Bootstrap stylesheet files)
- **Dependencies to Remove:**
  - `@coreui/coreui`, `@coreui/react`, `@coreui/icons`, `@coreui/icons-react`, `@coreui/chartjs`, `@coreui/react-chartjs`, `@coreui/utils`
  - `miragejs`, `storybook-mirage`

---

## 3. Design System & Theme Specifications

### 3.1 Color Palette
- **Brand Primary (Deep Indigo):**
  - `#f4f0fd`, `#e4d9fa`, `#cbb6f5`, `#b08eef`, `#9664e8`, `#7c3aed`, `#6d28d9`, `#5b21b6`, `#4c1d95`, `#1e1338`
  - Primary color name: `brand`
  - Primary shade: `5` (`#7c3aed`) for active states, `6` (`#6d28d9`) for hover.
- **Semantic Accents:**
  - Success: Emerald (`teal` / `#10b981`)
  - Danger: Rose (`red` / `#f43f5e`)
  - Warning: Amber (`yellow` / `#f59e0b`)
  - Info: Sky (`blue` / `#0ea5e9`)
- **Backgrounds & Surfaces:**
  - Light mode body: `#f8fafc` (slate-50)
  - Light mode surface cards: `#ffffff` with border `1px solid #e2e8f0` and shadow `sm`
  - Dark mode body: `#0b0f19`
  - Dark mode surface cards: `#111827` with border `1px solid #1f2937`

### 3.2 Typography & RTL
- **Font Stack:** Google Font **Cairo** (`Cairo, sans-serif`) with fallback to system Arabic fonts (`Tahoma`, `Arial`).
- **RTL Configuration:**
  - Mantine direction explicitly set to `'rtl'`.
  - Stylis RTL plugin applied via Emotion cache.
  - Mirrored margins, paddings, table alignments, and tabler icons.
- **Date & Calendar Localization:**
  - `DatesProvider` configured with Arabic locale: `locale: 'ar'`, `firstDayOfWeek: 6` (Saturday), `weekendDays: [4, 5]` (Thursday & Friday).

### 3.3 Component Defaults
- `Button`: `radius: 'md'`, default height `38px`, subtle hover lift effect.
- `TextInput`, `Select`, `MultiSelect`: `radius: 'md'`, `size: 'sm'`, `variant: 'default'`.
- `Card`: `radius: 'md'`, `p: 'lg'`, `withBorder: true`.
- `Badge`: `radius: 'sm'`, `variant: 'light'`.

---

## 4. Layout & Navigation Architecture

### 4.1 Mantine `AppShell`
Replaces the legacy CoreUI `DefaultLayout`:
- **Header (`AppHeader.jsx`):**
  - Brand emblem + "جهبذ" (Gahbaz) logo.
  - Collapsible burger toggle for mobile and responsive drawer.
  - Search trigger or global command spotlight (`@mantine/spotlight`).
  - Dark/Light mode toggle button with smooth icon transition.
  - Notifications popover button with badge indicator.
  - User profile menu (`UserMenu.jsx`): Displays user name, role badge, avatar, and dropdown links (Profile, Settings, Logout).
- **Sidebar (`AppNavbar.jsx`):**
  - 260px desktop width, collapsible.
  - Grouped sections with section titles:
    1. **الرئيسية (Overview):** لوحة التحكم (Dashboard), التقارير والإحصائيات.
    2. **الأكاديميا (Academics):** الكليات (Colleges), التخصصات (Majors), المواد (Subjects), الفصول الدراسية (Semesters), المجموعات والدروس.
    3. **المستخدمين (Users):** الطلاب (Students), الأساتذة (Teachers), الإداريين (Admins).
    4. **النظام (System):** سجل النشاطات (Audit Logs), النسخ الاحتياطية.
  - Dynamic filtering: Navigation items displayed conditionally based on `user.role` (`admin`, `teacher`, `student`).
  - Active route highlighting via Mantine `NavLink` with primary brand accent.
- **Content Area:**
  - Wrapped in Mantine `Container` (`fluid`, `px="lg"`, `py="md"`).
  - React Router `<Outlet />` with smooth suspense fallback using Mantine `LoadingOverlay` or skeleton placeholders.

---

## 5. API Client & Data Layer Migration

### 5.1 Centralized Axios Client (`src/api/client.js`)
- Base URL configured to `/api/v1` (handled by Vite development proxy to `http://localhost:5000`).
- Credentials enabled: `withCredentials: true`.
- Request interceptor: attaches authorization headers if present.
- Response interceptor:
  - Unwraps response payload: returns `response.data` (containing `{ success, data, meta }`).
  - Error handler:
    - 401 Unauthorized: Clears active user state and redirects to `/login`.
    - 403 Forbidden: Triggers Mantine notification "ليس لديك الصلاحية لتنفيذ هذا الإجراء".
    - 400 Bad Request / 500 Internal Error: Triggers Mantine notification displaying backend message `error.response?.data?.message || 'حدث خطأ غير متوقع'`.

### 5.2 Domain API Modules
Each domain provides typed async functions with clean query parameter serialization:
- **`colleges.api.js`:**
  - `getColleges({ page = 1, limit = 10, search = '', sort = '-createdAt' })`
  - `getCollegeById(id)`
  - `createCollege(data)`
  - `updateCollege(id, data)`
  - `deleteCollege(id)`
- **`semesters.api.js`:**
  - `getSemesters({ page = 1, limit = 10, search = '', sort = '-createdAt' })`
  - `createSemester(data)`
  - `updateSemester(id, data)`
  - `deleteSemester(id)`
- **`students.api.js`, `teachers.api.js`, `admins.api.js`, `auditLogs.api.js`**: Follow identical signature patterns matching the backend contracts.

### 5.3 TanStack React Query v5 Integration
- Standard query client with `staleTime: 5 * 60 * 1000` (5 minutes) and `retry: 1`.
- Custom feature hooks:
  - `useColleges(params)`: Runs `queryKey: ['colleges', params]` with `keepPreviousData: true`.
  - `useCreateCollege()`: Mutates college data and invalidates `['colleges']` on success.
  - `useUpdateCollege()`: Updates college data and invalidates `['colleges']` on success.
  - `useDeleteCollege()`: Deletes college and invalidates `['colleges']` on success.
  - Consistent notification feedback via `@mantine/notifications` on mutation success/failure.

---

## 6. Standardized UI Components

### 6.1 `DataTable` Component
A reusable, robust table component that directly binds to backend paginated responses:
- **Props:**
  - `columns`: Array of `{ key, title, render }` column descriptors.
  - `data`: Array of rows (`data.data`).
  - `meta`: Pagination metadata (`meta.page`, `meta.limit`, `meta.total`, `meta.totalPages`).
  - `isLoading`: Boolean loading indicator (shows Mantine `Skeleton` rows).
  - `search`: Current search string.
  - `onSearchChange`: Callback for search input.
  - `onPageChange`: Callback for page changes.
  - `onLimitChange`: Callback for page size selector.
- **Features:**
  - Search input with debouncing (`useDebouncedValue` at 350ms).
  - Page size dropdown selector (`10`, `25`, `50`).
  - Mantine `Pagination` component in RTL mode with total item counter badge.
  - Empty state fallback (`EmptyState`) when `data.length === 0`.

### 6.2 `PageHeader` Component
- Standard layout for all pages:
  - Page Title & description subtitle.
  - Mantine `Breadcrumbs` navigation.
  - Action button slot (e.g., "+ إضافة كلية جديدة").

### 6.3 `StatCard` Component
- Used across Dashboards:
  - Metric title, value, icon, and optional percentage trend badge.
  - Polished card with subtle hover elevation.

### 6.4 `ConfirmModal` Component
- Accessible modal for confirming destructive operations (e.g. Deleting a college or student).
- Title, descriptive warning text, "تأكيد الحذف" (Danger button) and "إلغاء" (Cancel button).

---

## 7. Migration & Rollout Strategy

1. **Phase 1: Foundation & Theme Setup:**
   - Configure Mantine theme tokens, fonts, and RTL emotion cache in `src/theme/`.
   - Setup centralized `src/api/client.js` with Axios interceptors and Vite proxy validation.
2. **Phase 2: AppShell Layout & Navigation:**
   - Create `src/layouts/MainLayout.jsx`, `AppHeader.jsx`, `AppNavbar.jsx`, and `UserMenu.jsx`.
   - Update `App.jsx` and router to use the new `MainLayout`.
   - Verify responsive drawer behavior and theme toggle.
3. **Phase 3: Core Primitives & Cleanups:**
   - Implement `DataTable`, `PageHeader`, `StatCard`, `EmptyState`, and `ConfirmModal`.
   - Delete `src/server.js`, `src/fake_db.json`, `src/pages/crud.js`.
   - Purge `@coreui/*` references and unused CSS.
4. **Phase 4: Admin Pages Migration:**
   - Migrate Colleges (`src/pages/admin/Collages.jsx`), Semesters, Students, Teachers, and Admins to the new `DataTable` and domain API hooks.
   - Verify pagination, search filtering, and CRUD operations against the live backend.
5. **Phase 5: Verification & End-to-End Testing:**
   - Validate full browser flow (login, navigation, search, pagination, create/edit modals, dark/light toggle) using `browser_subagent`.

---

## 8. Success Criteria
- [ ] No remaining `@coreui/*` imports or legacy SCSS dependencies.
- [ ] Clean build via `pnpm run build` with zero compiler/bundler warnings or errors.
- [ ] Real-time communication with the backend on `http://localhost:5000/api/v1` without MirageJS mocks.
- [ ] Responsive, modern Mantine UI rendering flawlessly in Arabic RTL with Cairo font.
- [ ] Server-side pagination and search functioning seamlessly across all listing tables.
