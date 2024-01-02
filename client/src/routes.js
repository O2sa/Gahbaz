import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

//Admin
const ManageUsers = React.lazy(() => import('./admin/users'))
const CurrentTerm = React.lazy(() => import('./admin/CurrentTerm'))
const adminSetting = React.lazy(() => import('./admin/test'))
const adminDashboard = React.lazy(() => import('./admin/Dashboard'))

//Student
const studentCourses = React.lazy(() => import('./student/courses'))
const studentGrades = React.lazy(() => import('./student/grades'))
const studentDash = React.lazy(() => import('./student/Dashboard'))

//Teacher
const teacherCourses = React.lazy(() => import('./teacher/courses'))

const adminRoutes = [
  { path: '/', exact: true, name: 'الرئيسية' },
  { path: '/dashboard', name: 'اللوحة', element: adminDashboard },
  { path: '/theme', name: 'ثيم', element: Colors, exact: true },
  { path: '/theme/colors', name: 'الوان', element: Colors },
  { path: '/admin/users', name: 'الوان', element: ManageUsers },
  { path: '/admin/currentterm', name: 'الوان', element: CurrentTerm },
  { path: '/admin/test', name: 'الوان', element: adminSetting },
  { path: '/theme/typography', name: 'تبوجرافي', element: Typography },
]

const studentRoutes = [
  { path: '/', exact: true, name: 'الرئيسية' },
  { path: '/courses', name: 'الدورات', element: studentCourses },
  { path: '/dashboard', name: 'اللوحة', element: studentDash },
  { path: '/grades', name: 'الدرجات', element: studentGrades },
  // { path: '/teacher/courses', name: 'الدورات', element: teacherCourses },
]

const teacherRoutes = [
  { path: '/', exact: true, name: 'الرئيسية' },
  { path: '/dashboard', name: 'اللوحة', element: Dashboard },
  { path: '/teacher/courses', name: 'الدورات', element: teacherCourses },
  { path: '/teacher/profile', name: 'الملف الشخصي', element: Dashboard },
]
export default function getRoutes() {
  const UserRole = localStorage.getItem('user')

  if (UserRole == 'admin') {
    return adminRoutes
  } else if (UserRole == 'student') {
    return studentRoutes
  } else if (UserRole == 'teacher') {
    return teacherRoutes
  }
}
