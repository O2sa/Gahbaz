# Frontend Redesign & UX Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Gahbaz frontend into a modern, high-contrast Academic SaaS application with dynamic Dark/Light mode, an elevated AppShell, high-impact Landing & Split Auth screens, and role-tailored Dashboards and DataTables.

**Architecture:** Build on Mantine v6 with RTL support (`stylis-plugin-rtl`) and Google Font Cairo. Implement a persistent `ColorSchemeProvider` (`light`/`dark`), establish design tokens in `theme/`, rebuild `AppHeader` and `AppNavbar` with glassmorphic cards and active route pills, revamp `Landing.jsx` and `Login.jsx`/`Register.jsx`, and polish Dashboards and DataTables with status chips and confirmation modals.

**Tech Stack:** React 18, Vite, Mantine v6 (`@mantine/core`, `@mantine/hooks`, `@mantine/form`, `@mantine/notifications`), Tabler Icons (`@tabler/icons-react`), TanStack React Query v5, Axios.

**Spec:** `docs/superpowers/specs/2026-10-12-frontend-redesign.md`

## Global Constraints
- Target workspace: `client/`
- Design aesthetic: Modern Academic SaaS (Deep Indigo/Navy `#1E40AF` & `#3B82F6`, Emerald `#10B981`, soft glassmorphism blur)
- Native Arabic RTL direction with font **Cairo**
- Zero reliance on external UI frameworks (Mantine v6 and Tabler Icons exclusively)
- Zero mock servers; all endpoints communicate with `http://localhost:5000/api/v1`
- Clean production build (`pnpm run build` must exit 0) and green backend tests (66/66)

---

### Task 1: Design System & ColorSchemeProvider (Dark/Light Mode)

**Files:**
- Modify: `client/src/theme/index.js`
- Modify: `client/src/App.jsx`
- Modify: `client/src/index.css`

**Interfaces:**
- Produces: Persistent `colorScheme` (`light` | `dark`), `toggleColorScheme()`, rich `brand` palette tokens, and global surface styles.

- [ ] **Step 1: Update Theme Tokens with Deep Navy & Adaptive Surfaces**
Configure the `brand` color scale, dark/light surface tokens, and component default radius in `client/src/theme/index.js`.

```javascript
export const getMantineTheme = (colorScheme) => ({
  colorScheme,
  fontFamily: 'Cairo, system-ui, -apple-system, sans-serif',
  primaryColor: 'brand',
  colors: {
    brand: [
      '#eff6ff',
      '#dbeafe',
      '#bfdbfe',
      '#93c5fd',
      '#60a5fa',
      '#3b82f6',
      '#2563eb',
      '#1d4ed8',
      '#1e40af',
      '#1e3a8a',
    ],
  },
  defaultRadius: 'md',
  // ...other component theme overrides
})
```

- [ ] **Step 2: Connect `ColorSchemeProvider` in `App.jsx`**
Import `ColorSchemeProvider` from `@mantine/core`, use `useLocalStorage` from `@mantine/hooks` for `colorScheme`, and wrap the application.

- [ ] **Step 3: Enhance `index.css` for Theme Background and Transitions**
Add smooth background-color and color transitions to `body` and smooth scrollbar styling.

- [ ] **Step 4: Verify Theme Switching and Build**
Run `pnpm run build` in `client/` to verify zero compilation errors.

- [ ] **Step 5: Commit Task 1**
```bash
git add client/src/theme/ client/src/App.jsx client/src/index.css
git commit -m "feat(theme): implement dynamic Dark/Light mode and Academic SaaS tokens"
```

---

### Task 2: Elevated AppShell Layout & Navigation (Header, Sidebar & UserMenu)

**Files:**
- Modify: `client/src/layouts/AppHeader.jsx`
- Modify: `client/src/layouts/AppNavbar.jsx`
- Modify: `client/src/layouts/UserMenu.jsx`
- Modify: `client/src/layouts/MainLayout.jsx`

**Interfaces:**
- Consumes: `useMantineColorScheme()` for theme toggling, `useDashboardContext()` for current user data and logout.
- Produces: Glassmorphic topbar with sun/moon toggle and notifications bell, collapsible grouped sidebar with glow pills, and user menu with role badges.

- [ ] **Step 1: Rebuild `AppHeader.jsx` with Glassmorphism and Theme Toggle**
Implement a glassmorphic top bar with `backdrop-filter: blur(12px)`, logo badge, notifications button with active indicator, dark/light toggle icon button, and user menu.

- [ ] **Step 2: Rebuild `AppNavbar.jsx` with Category Groupings & Active Glow Pills**
Group navigation links under *الرئيسية*, *الإدارة الأكاديمية*, *المستخدمون*, *التواصل*. Style active routes with soft gradient background and bold typography. Support mobile drawer auto-closing.

- [ ] **Step 3: Enhance `UserMenu.jsx` with Role Badge and Profile Shortcut**
Display user name, avatar, role pill (`مدير نظام`, `معلم`, `طالب`), profile link, and illuminated red logout button.

- [ ] **Step 4: Verify AppShell in Dev Server**
Run `pnpm run build` to confirm build passes, and test header/sidebar rendering.

- [ ] **Step 5: Commit Task 2**
```bash
git add client/src/layouts/
git commit -m "feat(layout): redesign glassmorphic AppHeader, grouped AppNavbar, and UserMenu"
```

---

### Task 3: Modern High-Impact Landing Page

**Files:**
- Modify: `client/src/pages/public/Landing.jsx`
- Modify: `client/src/pages/public/landing_components/Header.jsx`
- Modify: `client/src/pages/public/landing_components/Footer.jsx`
- Modify: `client/src/pages/public/landing_components/SectionOne.jsx`
- Modify: `client/src/pages/public/landing_components/SectionTwo.jsx`
- Modify: `client/src/pages/public/landing_components/SectionThree.jsx`
- Modify: `client/src/pages/public/landing_components/SectionFour.jsx`
- Modify: `client/src/pages/public/landing_components/About.jsx`

**Interfaces:**
- Produces: World-class Arabic EdTech landing page with hero metrics, glassmorphic feature grid, role showcase, and polished header/footer.

- [ ] **Step 1: Overhaul Landing Header & Hero Section**
Implement sticky glass header with smooth scrolling navigation and login CTA. Build an impactful hero section with dual action buttons and floating metric cards.

- [ ] **Step 2: Redesign Feature Grid with Glowing Glass Cards**
Present the 4 key pillars of Gahbaz (Academic Structure, Digital Lectures, Grade Management, Interactive Chat) in responsive glassmorphic cards.

- [ ] **Step 3: Add Role-Based Feature Showcase Tabs**
Interactive tab selector previewing features tailored for Admins, Faculty, and Students.

- [ ] **Step 4: Polish Footer with Academic Branding and Metadata**
Responsive footer with logo, description, copyright, and platform quick links.

- [ ] **Step 5: Verify Landing Page Build**
Run `pnpm run build` in `client/` to verify zero compile errors.

- [ ] **Step 6: Commit Task 3**
```bash
git add client/src/pages/public/Landing.jsx client/src/pages/public/landing_components/
git commit -m "feat(landing): redesign modern Arabic EdTech landing page with hero metrics and glass cards"
```

---

### Task 4: Split-Screen Authentication Suite (Login & Register)

**Files:**
- Modify: `client/src/pages/public/Login.jsx`
- Modify: `client/src/pages/public/Register.jsx`

**Interfaces:**
- Consumes: `client.post('/auth/login')` and `client.post('/auth/register')`.
- Produces: Split-screen visual authentication with 1-click test credentials selector, password visibility toggle, and instant feedback.

- [ ] **Step 1: Rebuild `Login.jsx` with Split-Screen Layout**
Create a two-column desktop layout:
- Right column: Deep indigo gradient with platform branding and academic vision.
- Left column: Centered high-contrast card with email, password, remember me, and quick credentials buttons for Admin, Teacher, and Student.

- [ ] **Step 2: Rebuild `Register.jsx` with Matching Split-Screen Styling**
Consistent split-screen layout with full name, email, password, role selector, and validation.

- [ ] **Step 3: Verify Login and Register Flows**
Run `pnpm run build` and smoke test login submission with demo credentials.

- [ ] **Step 4: Commit Task 4**
```bash
git add client/src/pages/public/Login.jsx client/src/pages/public/Register.jsx
git commit -m "feat(auth): implement modern split-screen Login and Register with quick demo credentials"
```

---

### Task 5: Role-Tailored Dashboards (Admin, Teacher, Student)

**Files:**
- Modify: `client/src/pages/admin/Dashboard.jsx`
- Modify: `client/src/pages/teacher/Dashboard.jsx`
- Modify: `client/src/pages/student/Dashboard.jsx`
- Modify: `client/src/components/common/StatCard.jsx`

**Interfaces:**
- Consumes: System metrics (`/system/get-admin-dash`), user courses and academic stats.
- Produces: Rich KPI stat cards, real-time system performance monitor with themed line charts, and role-tailored academic overview widgets.

- [ ] **Step 1: Enhance `StatCard.jsx` Component**
Add subtle hover elevation, trend percentage badges (positive/negative), and adaptive background colors.

- [ ] **Step 2: Rebuild `admin/Dashboard.jsx`**
Add welcome banner, 4 KPI cards (Colleges, Students, Teachers, Courses), and style real-time CPU/Memory/Network charts with adaptive dark/light grid lines. Add quick-action buttons.

- [ ] **Step 3: Rebuild `teacher/Dashboard.jsx` and `student/Dashboard.jsx`**
Create rich overview widgets for teacher course management and student enrolled courses, progress bars, and GPA summary.

- [ ] **Step 4: Verify Dashboards Build**
Run `pnpm run build` in `client/` to verify zero compile errors.

- [ ] **Step 5: Commit Task 5**
```bash
git add client/src/pages/admin/Dashboard.jsx client/src/pages/teacher/Dashboard.jsx client/src/pages/student/Dashboard.jsx client/src/components/common/StatCard.jsx
git commit -m "feat(dashboards): modernize Admin, Teacher, and Student dashboards with KPI cards and charts"
```

---

### Task 6: DataTables, PageHeaders & CRUD Modals Elevation

**Files:**
- Modify: `client/src/components/common/DataTable.jsx`
- Modify: `client/src/components/common/PageHeader.jsx`
- Modify: `client/src/components/common/ConfirmModal.jsx`
- Modify: `client/src/components/common/EmptyState.jsx`
- Check: Primary management pages (`Collages.jsx`, `Semesters.jsx`, `Majors.jsx`, `Subjects.jsx`, `Students.jsx`, `Teachers.jsx`, `Admins.jsx`)

**Interfaces:**
- Produces: Polished interactive tables with hover glow, status chips with glowing dots, debounced search, custom page sizing, and smooth animated modals.

- [ ] **Step 1: Elevate `PageHeader.jsx` and `DataTable.jsx`**
Add subtle search bar styling, rows-per-page selector, and clean row borders with hover background transition.

- [ ] **Step 2: Polish `EmptyState.jsx` and `ConfirmModal.jsx`**
Ensure empty states have modern icons and clear actions. Give `ConfirmModal` a friendly warning badge and smooth backdrop blur.

- [ ] **Step 3: Verify Academic Management Pages**
Check that `Collages`, `Majors`, `Subjects`, `Semesters`, `Students`, `Teachers`, and `Admins` render beautifully with the new theme and DataTable styling.

- [ ] **Step 4: Commit Task 6**
```bash
git add client/src/components/common/
git commit -m "feat(components): elevate DataTable, PageHeader, EmptyState, and ConfirmModal"
```

---

### Task 7: Full System Verification & Smoke Test

**Files:**
- Entire codebase (`client/` and `backend/`)

- [ ] **Step 1: Run Full Production Build**
Run `pnpm run build` in `client/` and verify exit code 0.

- [ ] **Step 2: Run Backend Integration Test Suite**
Run `pnpm test` in `backend/` and confirm all 66 tests pass.

- [ ] **Step 3: Browser Subagent Verification**
Launch browser subagent to test:
- Home / Landing page (`/`)
- Dark / Light mode toggle
- Login page (`/login`) with demo credentials
- Admin Dashboard and Colleges management page
- Verify responsive layout and console error log is clean.

- [ ] **Step 4: Final Development Branch Review**
Review git status and prepare integration summary.
