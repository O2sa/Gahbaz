import React from 'react'
import { Route } from 'react-router-dom'

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
// const Collages = React.lazy(() => import('./admin/Collages'))
// import Collages from './stories/screens/Collages'
import CollageInfo from './stories/screens/CollageInfo'
import { loader as collagesLoader } from './stories/screens/Collages'
import AboutCollage from './stories/SpecialComponents/AboutCollage'
import { AddField } from './stories/screens/AddField'
import { TabsBody } from './stories/Tabs/TabsBody'
import CardsGroup from './stories/SpecialComponents/CardsGroup'
import AboutField from './stories/SpecialComponents/AboutField'
import { AddSubject } from './stories/screens/AddSubject'
import { SemesterTemplateDetails } from './stories/SpecialComponents/SemesterTemplateDetails'
import { SemestersTemplate } from './stories/SpecialComponents/SemestersTemplate'
import Semesters from './stories/screens/Semesters'
import { Semesters as CurrentSemesters } from './stories/SpecialComponents/Semesters'
import { CurrentSemester } from './stories/screens/CurrentSemester'
import { Course } from './stories/screens/Course'
import { CreateCourse } from './stories/screens/CreateCourse'
import { EditCourseInfo } from './stories/SpecialComponents/EditCourseInfo'
import { EditCourseSection } from './stories/SpecialComponents/EditCourseSection'
import {
  AddLessonDescription,
  EditCourseSections,
  EditSectionTitle,
  UploadLessonVideo,
} from './stories/SpecialComponents/EditCourseSections'
import { Courses } from './stories/screens/Courses'
import { Lesson } from './stories/screens/Lesson'
import StudentGrades from './stories/screens/StudentGrades'
const Collages = React.lazy(() => import('./stories/screens/Collages'))
const FieldInfo = React.lazy(() => import('./stories/screens/FieldInfo'))
const adminSetting = React.lazy(() => import('./admin/test'))
const adminDashboard = React.lazy(() => import('./admin/Dashboard'))

//Student
const studentCourses = React.lazy(() => import('./student/courses'))
const studentGrades = React.lazy(() => import('./student/grades'))
const Grades = React.lazy(() => import('./student/grades'))
const studentDash = React.lazy(() => import('./student/Dashboard'))

//Teacher
const teacherCourses = React.lazy(() => import('./teacher/courses'))

const adminRoutes = [
  //admin
  { index: true, name: 'لوحة التحكم', element: <Dashboard /> },
  { path: 'usersManagement', name: 'إدارة المستخدمين', element: <ManageUsers /> },
  {
    path: 'collages',
    name: 'إدارة الكليات',
    element: <Collages />,
    // loader: collagesLoader,
    childern: [],
  },
  {
    path: 'collages/:id',
    name: 'إدارة الكليات',
    element: <CollageInfo />,
    children: [
      {
        // path: 'about',
        index: true,
        name: 'About Collage',
        element: <AboutCollage />,
      },
      {
        path: 'fields',
        name: 'collage fields',
        element: (
          <>
            {' '}
            <TabsBody addModel={AddField} label={'إضافة تخصص'} title={'التخصصات'} />,
            <CardsGroup editModel={AddField} collection={'fields'} />
          </>
        ),
      },
      {
        path: 'subjects',
        name: 'المواد',
        element: (
          <>
            {' '}
            <TabsBody addModel={AddSubject} label={'تعديل'} title={'التخصصات'} />
            <div className="mt-5">
              <CardsGroup editModel={AddSubject} collection={'subjects'} />{' '}
            </div>
          </>
        ),
      },
    ],
  },
  {
    path: 'collages/:id/fields/:id',
    name: 'إدارة الكليات',
    element: <FieldInfo />,
    children: [
      {
        // path: 'about',
        index: true,
        name: 'About Collage',
        element: <AboutField />,
      },
      {
        path: 'semesterTemplates',
        name: 'collage fields',
        element: (
          <>
            {' '}
            <TabsBody addModel={AddField} label={'إضافة تخصص'} title={'التخصصات'} />,
            <SemestersTemplate />{' '}
          </>
        ),
        children: [
          {
            // index: true,
            path: ':id',
            name: 'About Collage',
            element: <SemesterTemplateDetails title={''} />,
          },
        ],
      },
      {
        path: 'subjects',
        name: 'collage subjects',
        element: (
          <>
            {' '}
            <TabsBody label={'تعديل'} title={'التخصصات'} />
            <div className="mt-5">
              <CardsGroup collection={'subjects'} />{' '}
            </div>
          </>
        ),
      },
    ],
  },

  {
    path: 'semesters',
    name: 'الفصول الدراسية',
    element: <Semesters />,
    children: [
      {
        // path: 'about',
        index: true,
        name: 'About Collage',
        element: <CurrentSemesters />,
      },
    ],
  },
  {
    path: 'currentSemester/:id',
    name: 'الفصل الحالي',
    element: <CurrentSemester />,
  },
  {
    path: 'currentSemester/:id/course/:id',
    name: 'الدورة',
    element: <Course />,
  },
  {
    path: 'currentSemester/:id/addCourse/:id',
    name: 'إضافة دورة',
    element: <CreateCourse />,
    children: [
      {
        index: true,
        name: '',
        element: <EditCourseInfo />,
      },
      {
        path: 'grades',
        name: 'الدرجات',
        element: <StudentGrades />,
      },
      {
        path: 'lessons',
        name: 'الدروس',
        element: <EditCourseSections />,
        children: [
          {
            path: 'editSectionTitle/:id',
            name: 'الفصول الدراسية',
            element: <EditSectionTitle />,
          },
          {
            path: 'uploadLessonVideo/:id',
            name: 'الفصول الدراسية',
            element: <UploadLessonVideo />,
          },
          {
            path: 'addLessonDescription/:id',
            name: 'الفصول الدراسية',
            element: <AddLessonDescription />,
          },
        ],
      },
    ],
  },


  //student
  {
    path: 'courses',
    name: 'الفصول الدراسية',
    element: <Courses />,
  },
  {
    path: 'courses/:id',
    name: 'الفصول الدراسية',
    element: <Course admin={false} />,
  },
  {
    path: 'course/lessons/:id',
    name: 'الفصول الدراسية',
    element: <Lesson />,
  },
  {
    path: 'course/study/:id',
    name: 'الفصول الدراسية',
    element: <Lesson />,
  },
  {
    path: 'grades',
    name: 'الفصول الدراسية',
    element: <Grades />,
  },
  {
    path: 'profile',
    name: 'الفصول الدراسية',
    element: <studentCourses />,
  },
  { path: '/base/accordion', name: 'الفصول الدراسية', element: <adminSetting /> },
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
  // const UserRole = localStorage.getItem('user')
  const UserRole = 'admin'

  if (UserRole == 'admin') {
    return adminRoutes
  } else if (UserRole == 'student') {
    return studentRoutes
  } else if (UserRole == 'teacher') {
    return teacherRoutes
  }
}

export function getNestedRoutes() {
  {
    return getRoutes().map((route, idx) => {
      return (
        route.element && (
          <Route
            key={idx}
            path={route.path}
            exact={route.exact}
            name={route.name}
            element={<route.element />}
          />
        )
      )
    })
  }
}
export { adminRoutes, studentRoutes, teacherRoutes }
