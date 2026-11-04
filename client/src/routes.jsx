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
  UserProfile,
  CourseAssignments,
  Universities,
  UniversityOnboarding,
} from './pages/admin'

import { EditCourseInfo, loader as courseInfoEditLoader } from './pages/admin/EditCourseInfo'
import { EditCourseSections } from './pages/admin/EditCourseSections'
import { loader as studentGradesLoader } from './pages/admin/StudentGrades'

import { StudentGrade, CourseRegistration, Transcript } from './pages/student'
import ChatRoom from './chat/ChatContainer'

import DefaultLayout from './layouts/MainLayout.jsx'
import {
  Login,
  Page404,
  Page500,
  Profile,
  Register,
  Error,
  Landing,
  Courses,
  Dashboard,
} from './pages/public'

import { loader as lessonsLoader } from './pages/admin/Lessons'
import { RootLayout } from './layouts/RootLayout'
import i18n from './i18n'

const tRoute = (key, fallback) => i18n.t(`routes.${key}`, { ns: 'nav', defaultValue: fallback })

export default function getRoutes(queryClient, user) {
  // const { user } = useDashboardContext()

  const routes = [
    {
      path: '/',
      name: tRoute('home', 'الرئيسية'),
      element: <RootLayout queryClient={queryClient} />,
      errorElement: <Error />,
      children: [
        { index: true, name: tRoute('landing', 'صفحة البدء'), element: <Landing /> },
        { path: 'landing', name: tRoute('landing', 'صفحة البدء'), element: <Landing /> },
        { path: 'login', name: tRoute('login', 'تسجيل الدخول'), element: <Login /> },
        { path: 'register', name: tRoute('register', 'إنشاء حساب'), element: <Register /> },
        { path: 'onboarding/university', name: tRoute('onboarding', 'إعداد الجامعة'), element: <UniversityOnboarding /> },
        { path: '404', name: tRoute('notFound', 'غير موجود'), element: <Page404 /> },
        { path: '500', name: tRoute('serverError', 'خطأ!'), element: <Page500 /> },

        {
          name: tRoute('academicSystem', 'المنظومة الأكاديمية'),
          element: <DefaultLayout queryClient={queryClient} />,
          errorElement: <Error />,
          children: [
            // Authenticated Dashboard
            { path: 'dashboard', name: tRoute('dashboard', 'لوحة التحكم'), element: <Dashboard queryClient={queryClient} /> },
            {
              path: 'universities',
              name: tRoute('universities', 'إدارة الجامعات والمؤسسات'),
              element: <Universities queryClient={queryClient} />,
            },
            {
              path: 'profile',
              name: tRoute('profile', 'الملف الشخصي'),
              element: <Profile queryClient={queryClient} />,
            },
        
            {
              path: 'chat',
              name: tRoute('chat', 'المحادثات'),
              element: <ChatRoom queryClient={queryClient} />,
            },
            {
              path: 'collages',
              name: tRoute('colleges', 'إدارة الكليات'),
              element: <Collages queryClient={queryClient} />,
            },
            {
              path: 'collages/:id',
              name: tRoute('college', 'الكلية'),
              element: <CollageInfo queryClient={queryClient} />,
              children: [
                {
                  index: true,
                  name: tRoute('aboutCollege', 'عن الكلية'),
                  element: <AboutCollage queryClient={queryClient} />,
                },
                {
                  path: 'majors',
                  name: tRoute('majors', 'التخصصات'),
                  element: <Majors queryClient={queryClient} />,
                },
                {
                  path: 'subjects',
                  name: tRoute('subjects', 'المواد'),
                  element: <Subjects queryClient={queryClient} />,
                },
              ],
            },
            {
              path: 'collages/:collageId/majors/:majorId',
              name: tRoute('major', 'التخصص'),
              element: <MajorInfo queryClient={queryClient} />,
              children: [
                {
                  index: true,
                  name: tRoute('aboutMajor', 'عن التخصص'),
                  element: <AboutMajor queryClient={queryClient} />,
                },
                {
                  path: 'semesterTemplates',
                  name: tRoute('studyPlan', 'الخطة الدراسية'),
                  element: <SemestersTemplate queryClient={queryClient} />,
                },
              ],
            },
            {
              path: 'majors',
              name: tRoute('majors', 'إدارة التخصصات'),
              element: <Majors queryClient={queryClient} />,
            },
            {
              path: 'majors/:majorId',
              name: tRoute('major', 'التخصص'),
              element: <MajorInfo queryClient={queryClient} />,
              children: [
                {
                  index: true,
                  name: tRoute('aboutMajor', 'عن التخصص'),
                  element: <AboutMajor queryClient={queryClient} />,
                },
                {
                  path: 'semesterTemplates',
                  name: tRoute('studyPlan', 'الخطة الدراسية'),
                  element: <SemestersTemplate queryClient={queryClient} />,
                },
              ],
            },
            {
              path: 'subjects',
              name: tRoute('subjects', 'دليل المواد الأكاديمية'),
              element: <Subjects queryClient={queryClient} />,
            },
            {
              path: '/users',
              name: tRoute('users', 'المستخدمون'),
              element: <Users queryClient={queryClient} />,
              children: [
                {
                  // path: 'admins',
                  index: true,
                  name: tRoute('admins', 'المدراء'),
                  element: <Admins queryClient={queryClient} />,
                },
                {
                  path: 'teachers',
                  name: tRoute('teachers', 'المعلمون'),
                  element: <Teachers queryClient={queryClient} />,
                },
                {
                  path: 'students',
                  name: tRoute('students', 'الطلاب'),
                  element: <Students queryClient={queryClient} />,
                  children: [],
                },
              ],
            },
    
            {
              path: '/users/:userId',
              name: tRoute('userInfo', 'معلومات المستخدم'),
              element: <UserProfile queryClient={queryClient} />,
            },
    
            {
              path: 'semesters',
              name: tRoute('semesters', 'الفصول الدراسية'),
              element: <Semesters queryClient={queryClient} />,
            },
            {
              path: 'semesters/:semesterId',
              name: tRoute('currentSemester', 'الفصل الحالي'),
              element: <Semester queryClient={queryClient} />,
            },
    
            { path: 'courses', name: tRoute('courses', 'الدورات'), element: <Courses queryClient={queryClient} /> },
    
            {
              path: 'courses/:courseId',
              name: tRoute('course', 'الدورة'),
              element: <Course queryClient={queryClient} />,
            },
            {
              path: 'courses/:courseId/grades',
              name: tRoute('gradesRecord', 'سجل الدرجات'),
              element: <StudentGrades queryClient={queryClient} />,
              loader: studentGradesLoader(queryClient),
            },
            {
              path: 'courses/:courseId/assignments',
              name: tRoute('assignments', 'التكليفات والواجبات'),
              element: <CourseAssignments queryClient={queryClient} />,
            },
            {
              path: 'courses/:courseId/edit',
              name: tRoute('editCourse', 'تعديل الدورة'),
              element: <CreateCourse queryClient={queryClient} />,
              children: [
                {
                  index: true,
                  name: tRoute('basicInfo', 'المعلومات الأساسية'),
                  element: <EditCourseInfo queryClient={queryClient} />,
                  loader: courseInfoEditLoader(queryClient),
                },
                {
                  path: 'grades',
                  name: tRoute('grades', 'الدرجات'),
                  element: <StudentGrades queryClient={queryClient} />,
                  loader: studentGradesLoader(queryClient),
                },
                {
                  path: 'lessons',
                  name: tRoute('lessonsIndex', 'فهرس الدروس'),
                  element: <EditCourseSections queryClient={queryClient} />,
                },
              ],
            },
            {
              path: 'courses/:courseId/lessons',
              name: tRoute('lessons', 'الدروس'),
              element: <Lessons queryClient={queryClient} />,
              loader: lessonsLoader(queryClient),
    
              children: [
                {
                  path: ':sectionId/:lessonId',
                  // index: true,
                  name: tRoute('lesson', 'الدرس'),
                  element: <CourseLesson queryClient={queryClient} />,
                },
              ],
            },
    
            //teacher
    
            //student
            { path: 'grades', name: tRoute('grades', 'الدرجات'), element: <StudentGrade /> },
            { path: 'enrollment', name: tRoute('enrollmentPortal', 'المقررات والحذف'), element: <CourseRegistration /> },
            { path: 'transcript', name: tRoute('transcript', 'السجل الأكاديمي'), element: <Transcript /> },
          ],
          
        },
      ]
    
    }
  ]
  return routes
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
