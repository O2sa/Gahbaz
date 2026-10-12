# Frontend Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Gahbaz frontend to standardize on Mantine v6 with native Arabic RTL support, connect directly to the active backend API, and eliminate CoreUI and MirageJS legacy dependencies.

**Architecture:** Replace the legacy CoreUI / Bootstrap layouts with a clean Mantine `AppShell` and custom RTL Emotion cache. Build a modular API layer with Axios and TanStack React Query v5 that seamlessly consumes backend pagination metadata (`meta: { page, limit, total, totalPages }`). Migrate feature views to reusable Mantine primitives (`DataTable`, `PageHeader`, `StatCard`).

**Tech Stack:** React 18, Vite 5, Mantine v6 (`@mantine/core`, `@mantine/hooks`, `@mantine/notifications`), `@tabler/icons-react`, TanStack React Query v5, Axios.

**Spec:** [docs/superpowers/specs/2026-10-12-frontend-modernization-design.md](file:///c:/Users/msii/Documents/Gahbaz/docs/superpowers/specs/2026-10-12-frontend-modernization-design.md)

## Global Constraints

- Component Library: Exclusively Mantine v6 and `@tabler/icons-react` (no `@coreui/*` or Bootstrap classes).
- Typography & Layout: Arabic RTL default (`dir="rtl"`), font family **Cairo** (`Cairo, sans-serif`).
- Backend Connection: Connect to live backend on `http://localhost:5000/api/v1` via Vite proxy (`/api/v1`). No MirageJS mocks.
- Pagination Metadata: All table listings consume `{ success: true, data: [...], meta: { page, limit, total, totalPages } }`.
- Error Handling: Global Axios response interceptor for 401 redirect to `/login` and Mantine notifications for 400/403/500 errors.

---

### Task 1: Vite Proxy & Centralized API Client

**Files:**
- Modify: `client/vite.config.js:18-24`
- Create: `client/src/api/client.js`
- Create: `client/src/api/auth.api.js`
- Test: `client/src/api/__tests__/client.test.js`

**Interfaces:**
- Consumes: Backend HTTP server at `http://localhost:5000/api/v1`.
- Produces: `apiClient` Axios instance with error interceptors and `authApi` service methods (`login`, `logout`, `getCurrentUser`).

- [ ] **Step 1: Write integration test for apiClient and authApi**

Create `client/src/api/__tests__/client.test.js`:
```javascript
import apiClient from '../client'
import { authApi } from '../auth.api'

describe('API Client and Auth API', () => {
  it('should export configured apiClient instance', () => {
    expect(apiClient).toBeDefined()
    expect(apiClient.defaults.baseURL).toBe('/api/v1')
  })

  it('should define authApi methods', () => {
    expect(typeof authApi.login).toBe('function')
    expect(typeof authApi.logout).toBe('function')
    expect(typeof authApi.getCurrentUser).toBe('function')
  })
})
```

- [ ] **Step 2: Update Vite proxy configuration**

Update `client/vite.config.js` to proxy `/api` cleanly to `http://localhost:5000`:
```javascript
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
```

- [ ] **Step 3: Create centralized API client**

Create `client/src/api/client.js`:
```javascript
import axios from 'axios'
import { notifications } from '@mantine/notifications'

const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.message || error?.response?.data?.msg || 'حدث خطأ غير متوقع'

    if (status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      notifications.show({
        id: 'forbidden-error',
        color: 'red',
        title: 'غير مصرح',
        message: 'ليس لديك الصلاحية لتنفيذ هذا الإجراء',
        autoClose: 4000,
      })
    } else if (status >= 400) {
      notifications.show({
        id: 'api-error',
        color: 'red',
        title: 'خطأ',
        message: message,
        autoClose: 5000,
      })
    }

    return Promise.reject(error)
  }
)

export default apiClient
```

- [ ] **Step 4: Create Auth API module**

Create `client/src/api/auth.api.js`:
```javascript
import apiClient from './client'

export const authApi = {
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials)
  },
  logout: async () => {
    return apiClient.get('/auth/logout')
  },
  getCurrentUser: async () => {
    return apiClient.get('/users/current-user')
  },
}
```

- [ ] **Step 5: Run test or node validation to verify**

Run verification command:
```bash
node -e "const { authApi } = require('./src/api/auth.api.js'); console.log('Auth API loaded');"
```
Or run jest if available.

- [ ] **Step 6: Commit**

```bash
git add client/vite.config.js client/src/api/client.js client/src/api/auth.api.js
git commit -m "feat(client): add centralized api client and auth service"
```

---

### Task 2: Mantine Theme, Fonts & Emotion RTL Cache

**Files:**
- Create: `client/src/theme/index.js`
- Create: `client/src/theme/rtlCache.js`
- Modify: `client/index.html:10-56`
- Modify: `client/src/App.jsx:40-87`

**Interfaces:**
- Consumes: `@mantine/core`, `stylis-plugin-rtl`, Google Font Cairo.
- Produces: `mantineTheme` configuration object and `rtlCache` Emotion instance.

- [ ] **Step 1: Create RTL Emotion Cache**

Create `client/src/theme/rtlCache.js`:
```javascript
import { createEmotionCache } from '@mantine/core'
import rtlPlugin from 'stylis-plugin-rtl'

export const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
})
```

- [ ] **Step 2: Create Mantine Theme Definition**

Create `client/src/theme/index.js`:
```javascript
export const mantineTheme = {
  dir: 'rtl',
  fontFamily: 'Cairo, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Cairo, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: 600,
  },
  colors: {
    brand: [
      '#f4f0fd',
      '#e4d9fa',
      '#cbb6f5',
      '#b08eef',
      '#9664e8',
      '#7c3aed',
      '#6d28d9',
      '#5b21b6',
      '#4c1d95',
      '#1e1338',
    ],
  },
  primaryColor: 'brand',
  primaryShade: 5,
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
  },
}
```

- [ ] **Step 3: Update `index.html` with Cairo Font**

Add Cairo Google Font links to `client/index.html`:
```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Update `client/src/App.jsx` to use centralized theme**

Import `mantineTheme` and `rtlCache` in `client/src/App.jsx` and apply to `<MantineProvider theme={mantineTheme} emotionCache={rtlCache}>`.

- [ ] **Step 5: Verify App rendering and styles**

Run `pnpm run build` or inspect in browser to ensure Cairo font and RTL styles compile cleanly.

- [ ] **Step 6: Commit**

```bash
git add client/index.html client/src/theme/index.js client/src/theme/rtlCache.js client/src/App.jsx
git commit -m "feat(client): configure cairo font, rtl emotion cache, and mantine theme"
```

---

### Task 3: Mantine AppShell Layout Replacement

**Files:**
- Create: `client/src/layouts/UserMenu.jsx`
- Create: `client/src/layouts/AppHeader.jsx`
- Create: `client/src/layouts/AppNavbar.jsx`
- Create: `client/src/layouts/MainLayout.jsx`
- Modify: `client/src/routes.jsx`

**Interfaces:**
- Consumes: Current user state from `authApi.getCurrentUser()` / React Query.
- Produces: `MainLayout` AppShell component wrapping nested route outlets.

- [ ] **Step 1: Create `UserMenu.jsx`**

Create `client/src/layouts/UserMenu.jsx`:
Displays Mantine `Menu`, `Avatar`, username, role badge, and actions for "الملف الشخصي" and "تسجيل الخروج".

- [ ] **Step 2: Create `AppHeader.jsx`**

Create `client/src/layouts/AppHeader.jsx`:
Mantine `Header` with responsive `Burger`, brand emblem, quick search bar, theme toggle, and `UserMenu`.

- [ ] **Step 3: Create `AppNavbar.jsx`**

Create `client/src/layouts/AppNavbar.jsx`:
Mantine `Navbar` with navigation sections (الرئيسية, الأكاديميا, المستخدمين, النظام) rendered via Mantine `NavLink` with `@tabler/icons-react` icons and role checking.

- [ ] **Step 4: Create `MainLayout.jsx`**

Create `client/src/layouts/MainLayout.jsx`:
Mantine `AppShell` integrating `AppHeader`, `AppNavbar`, and `<Outlet />` inside Mantine `<Container fluid px="md" py="lg">`.

- [ ] **Step 5: Update `routes.jsx` to use `MainLayout`**

Replace `import('./layout/DefaultLayout')` with `import('./layouts/MainLayout')`.

- [ ] **Step 6: Verify layout rendering in browser**

Verify responsive sidebar toggle, user menu, and route outlet in browser.

- [ ] **Step 7: Commit**

```bash
git add client/src/layouts/ client/src/routes.jsx
git commit -m "feat(client): replace coreui layout with mantine appshell layout"
```

---

### Task 4: Standardized Reusable UI Components

**Files:**
- Create: `client/src/components/common/DataTable.jsx`
- Create: `client/src/components/common/PageHeader.jsx`
- Create: `client/src/components/common/StatCard.jsx`
- Create: `client/src/components/common/EmptyState.jsx`
- Create: `client/src/components/common/ConfirmModal.jsx`
- Create: `client/src/components/common/index.js`

**Interfaces:**
- Consumes: Backend pagination contracts (`meta: { page, limit, total, totalPages }`).
- Produces: Reusable UI component suite for all listing and dashboard pages.

- [ ] **Step 1: Create `EmptyState.jsx`**

Create `client/src/components/common/EmptyState.jsx`:
Renders icon, title, description, and optional action button when list data is empty.

- [ ] **Step 2: Create `ConfirmModal.jsx`**

Create `client/src/components/common/ConfirmModal.jsx`:
Mantine `Modal` with title, message, danger confirm button, and cancel button.

- [ ] **Step 3: Create `PageHeader.jsx`**

Create `client/src/components/common/PageHeader.jsx`:
Mantine `Group` and `Title`, `Breadcrumbs`, and action button slot.

- [ ] **Step 4: Create `StatCard.jsx`**

Create `client/src/components/common/StatCard.jsx`:
Mantine `Paper` / `Card` with metric value, title, icon, and trend badge.

- [ ] **Step 5: Create `DataTable.jsx`**

Create `client/src/components/common/DataTable.jsx`:
Mantine `Table` with:
- Debounced search input (`useDebouncedValue`).
- Page size selector (`10`, `25`, `50`).
- Mantine `Pagination` component connected to `meta.page` and `meta.totalPages`.
- Total item counter badge.
- Loading skeleton rows when `isLoading` is true.
- `EmptyState` when `data.length === 0`.

- [ ] **Step 6: Export from `index.js` and verify**

Create `client/src/components/common/index.js` re-exporting all common primitives.

- [ ] **Step 7: Commit**

```bash
git add client/src/components/common/
git commit -m "feat(client): add reusable datatable, pageheader, and common ui components"
```

---

### Task 5: Domain API Services & TanStack Query Hooks

**Files:**
- Create: `client/src/api/colleges.api.js`
- Create: `client/src/api/semesters.api.js`
- Create: `client/src/api/students.api.js`
- Create: `client/src/api/teachers.api.js`
- Create: `client/src/api/admins.api.js`
- Create: `client/src/hooks/useColleges.js`
- Create: `client/src/hooks/useSemesters.js`
- Create: `client/src/hooks/useStudents.js`

**Interfaces:**
- Consumes: `apiClient` (`client/src/api/client.js`).
- Produces: Async domain functions and TanStack Query hooks supporting pagination & automatic invalidation.

- [ ] **Step 1: Create `colleges.api.js` & `useColleges.js`**

Implement `getColleges({ page, limit, search, sort })`, `createCollege`, `updateCollege`, `deleteCollege`.
Implement `useColleges(params)`, `useCreateCollege()`, `useUpdateCollege()`, `useDeleteCollege()`.

- [ ] **Step 2: Create `semesters.api.js` & `useSemesters.js`**

Implement `getSemesters({ page, limit, search, sort })`, `createSemester`, `updateSemester`, `deleteSemester`.
Implement `useSemesters(params)`, `useCreateSemester()`, etc.

- [ ] **Step 3: Create `students.api.js` & `useStudents.js`**

Implement `getStudents({ page, limit, search, sort })`, `createStudent`, `updateStudent`, `deleteStudent`.
Implement `useStudents(params)`.

- [ ] **Step 4: Create `teachers.api.js` and `admins.api.js`**

Implement API service methods for teachers and admins domains matching backend endpoints.

- [ ] **Step 5: Verify API functions with backend**

Call endpoints using node or test script to confirm proper serialization of `?page=1&limit=10&search=...`.

- [ ] **Step 6: Commit**

```bash
git add client/src/api/ client/src/hooks/
git commit -m "feat(client): add domain api services and tanstack query hooks"
```

---

### Task 6: Modernize Admin Pages (`Collages.jsx`, `Semesters.jsx`, `Students.jsx`)

**Files:**
- Modify: `client/src/pages/admin/Collages.jsx`
- Modify: `client/src/pages/admin/AddCollage.jsx`
- Modify: `client/src/pages/admin/EditCollage.jsx`
- Modify: `client/src/pages/admin/Semesters.jsx`
- Modify: `client/src/pages/admin/Students.jsx`

**Interfaces:**
- Consumes: `DataTable`, `PageHeader`, `ConfirmModal`, `useColleges`, `useSemesters`, `useStudents`.
- Produces: Polished, modern Mantine-powered admin views with real server-side pagination, search, and CRUD.

- [ ] **Step 1: Refactor `Collages.jsx`**

Replace CoreUI classes and ad-hoc `crud.js` calls with Mantine `DataTable`, `PageHeader`, and `useColleges({ page, limit, search })`.
Bind "+ إضافة كلية" modal and edit/delete actions using `useCreateCollege`, `useUpdateCollege`, and `useDeleteCollege`.

- [ ] **Step 2: Refactor `AddCollage.jsx` and `EditCollage.jsx`**

Update form modal to use Mantine `Modal`, `TextInput`, `Textarea`, and `@mantine/form`.

- [ ] **Step 3: Refactor `Semesters.jsx`**

Migrate to Mantine `DataTable` using `useSemesters({ page, limit, search })`.

- [ ] **Step 4: Refactor `Students.jsx`**

Migrate to Mantine `DataTable` using `useStudents({ page, limit, search })`.

- [ ] **Step 5: Verify in browser**

Test pagination, search filtering, addition, editing, and deletion in browser.

- [ ] **Step 6: Commit**

```bash
git add client/src/pages/admin/Collages.jsx client/src/pages/admin/AddCollage.jsx client/src/pages/admin/EditCollage.jsx client/src/pages/admin/Semesters.jsx client/src/pages/admin/Students.jsx
git commit -m "feat(client): modernize admin pages with mantine datatable and live api hooks"
```

---

### Task 7: Cleanup Legacy CoreUI, MirageJS & Build Verification

**Files:**
- Delete: `client/src/server.js`
- Delete: `client/src/fake_db.json`
- Delete: `client/src/pages/crud.js`
- Modify: `client/src/App.jsx` (remove `import './scss/style.scss'`)
- Modify: `client/package.json` (remove `@coreui/*`, `miragejs`)

**Interfaces:**
- Consumes: Cleaned codebase without legacy mocks.
- Produces: Production-ready client bundle.

- [ ] **Step 1: Remove MirageJS mock server files**

Delete `client/src/server.js` and `client/src/fake_db.json`.

- [ ] **Step 2: Remove `crud.js` and CoreUI SCSS imports**

Remove `client/src/pages/crud.js` and remove CoreUI SCSS imports from `client/src/App.jsx`.

- [ ] **Step 3: Run `pnpm run build`**

Execute:
```bash
pnpm run build
```
Verify build succeeds with zero errors.

- [ ] **Step 4: Run end-to-end browser smoke test**

Launch browser subagent or preview to verify login, navigation, RTL rendering, and admin tables.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(client): remove legacy coreui, miragejs mocks, and verify production build"
```
