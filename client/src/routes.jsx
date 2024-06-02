import React from 'react'
import { Route } from 'react-router-dom'

import {
  AddCollage,
  AddMajor,
  AddSubject,
  CollageInfo,
  Collages,
  CreateCourse,
  Semester,
  MajorInfo,
  Semesters,
  StudentGrades,
  AboutCollage,
  AboutMajor,
  Majors,
  Subjects,
  SemestersTemplate,
  SemesterTemplateDetails,
  Users,
  Admins,
  Students,
  Teachers,
  Course,
  Lessons,
  CourseLesson,
  StudentProfile,
  UserProfile,
} from './pages/admin'

import { Courses, Dashboard, Profile } from './pages/public'

import { EditCourseInfo } from './stories/SpecialComponents/EditCourseInfo'
// import { EditCourseSection } from './stories/SpecialComponents/EditCourseSection'

import { EditCourseSections } from './stories/SpecialComponents/EditCourseSections'

import { loader as collagesLoader } from './pages/admin/Collages'
import { loader as courseInfoEditLoader } from './stories/SpecialComponents/EditCourseInfo'
import { loader as studentGradesLoader } from './pages/admin/StudentGrades'
import { useDashboardContext } from './layout/DefaultLayout'
import {  TeacherDashboard } from './pages/teacher'
import { StudentGrade } from './pages/student'
import ChatRoom from './chat/ChatContainer'
// import Test from './chat/Test'
// import NewChat from './chat/chat/page'
//Student
// const studentGrades = React.lazy(() => import('./pages/student/grades'))
// const Grades = React.lazy(() => import('./pages/student/grades'))
// const studentDash = React.lazy(() => import('./pages/student/Dashboard'))

//Teacher
// const teacherCourses = React.lazy(() => import('./pages/teacher/courses'))
import {loader as lessonsLoader} from './pages/admin/Lessons'
export default function getRoutes(queryClient, user) {
  // const { user } = useDashboardContext()

  const adminRoutes = [
    //admin
    { index: true, name: 'لوحة التحكم', element: <Dashboard queryClient={queryClient} /> },
    {
      path: 'collages',
      name: 'إدارة الكليات',
      element: <Collages queryClient={queryClient} />,
      // loader: collagesLoader(queryClient),
    },
    {
      path: 'collages/:id',
      name: 'الكلية',
      element: <CollageInfo queryClient={queryClient} />,
      children: [
        {
          // path: 'about',
          index: true,
          name: 'عن الكية',
          element: <AboutCollage queryClient={queryClient} />,
        },
        {
          path: 'majors',
          name: 'التخصصات',
          element: <Majors queryClient={queryClient} />,
          children: [],
        },
        {
          path: 'subjects',
          name: 'المواد',
          element: <Subjects queryClient={queryClient} />,
        },
      ],
    },

    {
      path: 'profile',
      name: 'الملف الشخصي',
      element: <Profile queryClient={queryClient} />,
    },
    // {
    //   path: 'test',
    //   name: 'الملف الشخصي',
    //   element: <NewChat queryClient={queryClient} />,
    // },
    {
      path: 'chat',
      name: 'المحادثات',
      element: <ChatRoom queryClient={queryClient} />,
    },
    {
      path: 'collages/:id/majors/:id',
      name: 'التخصص',
      element: <MajorInfo queryClient={queryClient} />,
      children: [
        {
          // path: 'about',
          index: true,
          name: 'عن التخصص',
          element: <AboutMajor queryClient={queryClient} />,
        },
        {
          path: 'semesterTemplates',
          name: 'قوالب التخصص',
          element: <SemestersTemplate queryClient={queryClient} />,
        },
      ],
    },
    {
      path: '/users',
      name: 'المستخدمون',
      element: <Users queryClient={queryClient} />,
      children: [
        {
          // path: 'admins',
          index: true,
          name: 'المدراء',
          element: <Admins queryClient={queryClient} />,
        },
        {
          path: 'teachers',
          name: 'المعلمون',
          element: <Teachers queryClient={queryClient} />,
        },
        {
          path: 'students',
          name: 'الطلاب',
          element: <Students queryClient={queryClient} />,
          children: [],
        },
      ],
    },

    {
      path: '/users/:userId',
      name: 'معلومات المستخدم',
      element: <UserProfile queryClient={queryClient} />,
    },

    {
      path: 'semesters',
      name: 'الفصول الدراسية',
      element: <Semesters queryClient={queryClient} />,
    },
    {
      path: 'semesters/:semesterId',
      name: 'الفصل الحالي',
      element: <Semester queryClient={queryClient} />,
    },

    { path: 'courses', name: 'الدورات', element: <Courses queryClient={queryClient} /> },

    {
      path: 'courses/:courseId',
      name: 'الدورة',
      element: <Course queryClient={queryClient} />,
    },
    {
      path: 'courses/:courseId/edit',
      name: 'تعديل الدورة',
      element: <CreateCourse queryClient={queryClient} />,
      children: [
        {
          index: true,
          name: 'المعلومات الأساسية',
          element: <EditCourseInfo queryClient={queryClient} />,
          loader: courseInfoEditLoader(queryClient),
        },
        {
          path: 'grades',
          name: 'الدرجات',
          element: <StudentGrades queryClient={queryClient} />,
          loader: studentGradesLoader(queryClient),
        },
        {
          path: 'lessons',
          name: 'فهرس الدروس',
          element: <EditCourseSections queryClient={queryClient} />,
        },
      ],
    },
    {
      path: 'courses/:courseId/lessons',
      name: 'الدروس',
      element: <Lessons queryClient={queryClient} />,
      loader: lessonsLoader(queryClient),

      children: [
        {
          path: ':sectionId/:lessonId',
          // index: true,
          name: 'الدرس',
          element: <CourseLesson queryClient={queryClient} />,
        },
      ],
    },

    //teacher



    //student
    { path: 'grades', name: 'الدرجات', element: <StudentGrade /> },

  ]

  return adminRoutes
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
