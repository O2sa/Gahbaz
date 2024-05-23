import React, { Component, Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import getRoutes from './routes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './scss/style.scss'
import { ModalsProvider } from '@mantine/modals'
import { MantineProvider, createEmotionCache } from '@mantine/core'
import rtlPlugin from 'stylis-plugin-rtl'
import { Notifications } from '@mantine/notifications'
import 'dayjs/locale/ar'

import { DatesProvider } from '@mantine/dates'
// import { CloudinaryContext } from '@cloudinary/react'
// import { Cloudinary } from '@cloudinary/url-gen'

// Configure Cloudinary with your credentials
// const cloudinary = new Cloudinary({
//   cloud: {
//     cloudName: 'your_cloud_name',
//   },
// })

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

import { Login, Page404, Page500, Profile, Register } from './pages/public'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

const router = createBrowserRouter([
  { path: '/login', name: 'Login Page', element: <Login /> },
  { path: '/register', name: 'Register Page', element: <Register /> },
  { path: '/404', name: 'Page 404', element: <Page404 /> },
  { path: '/500', name: 'Page 500', element: <Page500 /> },
  {
    path: '/',
    name: 'Home',
    element: <DefaultLayout queryClient={queryClient} />,
    errorElement: <Page500 />,

    children: [
      ...getRoutes(queryClient),
      {
        path: 'profile',
        name: 'الملف الشخصي',
        element: <Profile queryClient={queryClient} />,
      },
    ],
  },
])

const rtlCache = createEmotionCache({
  key: 'mantine-rtl',
  stylisPlugins: [rtlPlugin],
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <CloudinaryContext cloudName="ddng3kwfw"> */}
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={rtlCache}
        theme={{
          dir: 'rtl',
          fontFamily: 'Cairo',
          colors: {
            brand: [
              '#f2eaff',
              '#d4c4f0',
              '#b69fe2',
              '#9979d4',
              '#7b52c6',
              '#6239ad',
              '#4c2c87',
              '#361e62',
              '#21123d',
              '#0d041a',
            ],
          },
          primaryColor: 'brand',
          primaryShade: 4,
        }}
      >
        <DatesProvider settings={{ locale: 'ar', firstDayOfWeek: 6, weekendDays: [4, 5] }}>
          <ModalsProvider labels={{ confirm: 'Submit', cancel: 'Cancel' }}>
            <Suspense fallback={loading}>
              <RouterProvider router={router} />
            </Suspense>{' '}
          </ModalsProvider>
        </DatesProvider>
        <Notifications />
      </MantineProvider>{' '}
      {/* </CloudinaryContext> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
