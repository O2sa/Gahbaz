import React from 'react'
import { Route } from 'react-router-dom'

import {
  AddCollage,
  AddMajor,
  AddSubject,
  AdminDashboard,
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
} from './pages/admin'

import { Profile } from './pages/public'

import { EditCourseInfo } from './stories/SpecialComponents/EditCourseInfo'
// import { EditCourseSection } from './stories/SpecialComponents/EditCourseSection'

import { EditCourseSections } from './stories/SpecialComponents/EditCourseSections'

import { loader as collagesLoader } from './pages/admin/Collages'
import { loader as courseInfoEditLoader } from './stories/SpecialComponents/EditCourseInfo'
import { loader as studentGradesLoader } from './pages/admin/StudentGrades'
import { useDashboardContext } from './layout/DefaultLayout'
import { TeacherCourses, TeacherDashboard } from './pages/teacher'
import { StudentCourses, StudentDashboard,StudentGrade } from './pages/student'
//Student
// const studentGrades = React.lazy(() => import('./pages/student/grades'))
// const Grades = React.lazy(() => import('./pages/student/grades'))
// const studentDash = React.lazy(() => import('./pages/student/Dashboard'))

//Teacher
// const teacherCourses = React.lazy(() => import('./pages/teacher/courses'))

export default function getRoutes(queryClient, user) {
  // const { user } = useDashboardContext()

  const adminRoutes = [
    //admin
    // { index: true, name: 'لوحة التحكم', element: <AdminDashboard /> },
    // { path: 'usersManagement', name: 'إدارة المستخدمين', element: <ManageUsers /> },
    {
      path: 'collages',
      name: 'إدارة الكليات',
      element: <Collages queryClient={queryClient} />,
      loader: collagesLoader(queryClient),
    },
    {
      path: 'collages/:id',
      name: 'إدارة الكليات',
      element: <CollageInfo queryClient={queryClient} />,
      children: [
        {
          // path: 'about',
          index: true,
          name: 'About Collage',
          element: <AboutCollage queryClient={queryClient} />,
        },
        {
          path: 'majors',
          name: ' Majors',
          element: <Majors queryClient={queryClient} />,
        },
        {
          path: 'subjects',
          name: 'المواد',
          element: <Subjects queryClient={queryClient} />,
        },
      ],
    },
    {
      path: 'majors/:id',
      name: 'إدارة الكليات',
      element: <MajorInfo queryClient={queryClient} />,
      children: [
        {
          // path: 'about',
          index: true,
          name: '',
          element: <AboutMajor queryClient={queryClient} />,
        },
        {
          path: 'semesterTemplates',
          name: 'semesterTemplates',
          element: <SemestersTemplate queryClient={queryClient} />,
        },
      ],
    },
    {
      path: 'users',
      name: ' ',
      element: <Users queryClient={queryClient} />,
      children: [
        {
          // path: 'about',
          index: true,
          name: '',
          element: <Admins queryClient={queryClient} />,
        },
        {
          path: 'teachers',
          name: 'Teachers',
          element: <Teachers queryClient={queryClient} />,
        },
        {
          path: 'students',
          name: 'students',
          element: <Students queryClient={queryClient} />,
        },
      ],
    },
    {
      path: 'lessons/:courseId',
      name: ' ',
      element: <Lessons queryClient={queryClient} />,
      children: [
        {
          path: ':sectionId/:lessonId',
          // index: true,
          name: '',
          element: <CourseLesson queryClient={queryClient} />,
        },
      ],
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
    {
      path: 'courses/:courseId',
      name: 'الدورة',
      element: <Course queryClient={queryClient} />,
    },

    {
      path: 'courses/:courseId/edit',
      name: 'إضافة دورة',
      element: <CreateCourse queryClient={queryClient} />,
      children: [
        {
          index: true,
          name: '',
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
          name: 'الدروس',
          element: <EditCourseSections queryClient={queryClient} />,
        },
      ],
    },

    //teacher
    { path: 'teacher/dash', name: 'لوحة التحكم', element: <TeacherDashboard /> },
    { path: 'teacher/courses', name: 'لوحة التحكم', element: <TeacherCourses /> },
    {
      path: 'teacher/courses/:courseId',
      name: 'لوحة التحكم',
      element: <Course queryClient={queryClient} />,
    },
    {
      path: 'teacher/lessons/:courseId',
      name: ' ',
      element: <Lessons queryClient={queryClient} />,
      children: [
        {
          path: ':sectionId/:lessonId',
          // index: true,
          name: '',
          element: <CourseLesson queryClient={queryClient} />,
        },
      ],
    },

    {
      path: 'teacher/courses/:courseId/edit',
      name: 'إضافة دورة',
      element: <CreateCourse queryClient={queryClient} />,
      children: [
        {
          index: true,
          name: '',
          element: <EditCourseInfo queryClient={queryClient} />,
          loader: courseInfoEditLoader(queryClient),
        },
        {
          path: 'grades',
          name: 'الدرجات',
          element: <StudentGrades queryClient={queryClient} />,
        },
        {
          path: 'lessons',
          name: 'الدروس',
          element: <EditCourseSections queryClient={queryClient} />,
        },
      ],
    },





    //student
    { path: 'student/dash', name: 'لوحة التحكم', element: <StudentDashboard /> },
    { path: 'student/courses', name: 'لوحة التحكم', element: <StudentCourses /> },
    { path: 'student/grades', name: 'لوحة التحكم', element: <StudentGrade /> },
    {
      path: 'student/courses/:courseId',
      name: 'لوحة التحكم',
      element: <Course queryClient={queryClient} />,
    },
    {
      path: 'student/lessons/:courseId',
      name: ' ',
      element: <Lessons queryClient={queryClient} />,
      children: [
        {
          path: ':sectionId/:lessonId',
          // index: true,
          name: '',
          element: <CourseLesson queryClient={queryClient} />,
        },
      ],
    },
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
