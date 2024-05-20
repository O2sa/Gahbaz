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
  AboutSemester,
  AddCourse,
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
  CourseLesson
} from './pages'

import { EditCourseInfo } from './stories/SpecialComponents/EditCourseInfo'
// import { EditCourseSection } from './stories/SpecialComponents/EditCourseSection'

import { EditCourseSections } from './stories/SpecialComponents/EditCourseSections'

import { loader as collagesLoader } from './pages/admin/Collages'
import { loader as courseInfoEditLoader } from './stories/SpecialComponents/EditCourseInfo'
import {loader as studentGradesLoader} from './pages/admin/StudentGrades'
//Student
// const studentGrades = React.lazy(() => import('./pages/student/grades'))
// const Grades = React.lazy(() => import('./pages/student/grades'))
// const studentDash = React.lazy(() => import('./pages/student/Dashboard'))

//Teacher
// const teacherCourses = React.lazy(() => import('./pages/teacher/courses'))

export default function getRoutes(queryClient) {
  return [
    //admin
    { index: true, name: 'لوحة التحكم', element: <AdminDashboard /> },
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
      path: 'semesters',
      name: 'الفصول الدراسية',
      element: <Semesters />,
    },
    {
      path: 'semesters/:id',
      name: 'الفصل الحالي',
      element: <Semester />,
    },
    {
      path: 'courses/:courseId',
      name: 'الدورة',
      element: <Course />,
    },
    {
      path: 'courses/:courseId/edit',
      name: 'إضافة دورة',
      element: <CreateCourse />,
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
          loader: studentGradesLoader(queryClient)
        },
        {
          path: 'lessons',
          name: 'الدروس',
          element: <EditCourseSections queryClient={queryClient} />,
        },
      ],
    },


    // //student

    // {
    //   path: 'course/study/:id',
    //   name: 'الفصول الدراسية',
    //   element: <Lesson />,
    // },
    // {
    //   path: 'grades',
    //   name: 'الفصول الدراسية',
    //   element: <Grades />,
    // },
    // {
    //   path: 'profile',
    //   name: 'الفصول الدراسية',
    //   element: <studentCourses />,
    // },
    // { path: '/base/accordion', name: 'الفصول الدراسية', element: <adminSetting /> },
  ]
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
