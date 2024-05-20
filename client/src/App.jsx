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
// Pages
const Login = React.lazy(() => import('./pages/public/Login'))
const Register = React.lazy(() => import('./pages/public/Register'))
const Page404 = React.lazy(() => import('./pages/public/Page404'))
const Page500 = React.lazy(() => import('./pages/public/Page500'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})
const router = createBrowserRouter([
  { exact: true, path: '/login', name: 'Login Page', element: <Login /> },
  { exact: true, path: '/register', name: 'Register Page', element: <Register /> },
  { exact: true, path: '/404', name: 'Page 404', element: <Page404 /> },
  { exact: true, path: '/500', name: 'Page 500', element: <Page500 /> },
  {
    path: '/',
    name: 'Home',
    element: <DefaultLayout />,
    children: getRoutes(queryClient),
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
          primaryShade: 4
        }}
      >
        <ModalsProvider labels={{ confirm: 'Submit', cancel: 'Cancel' }}>
          <Suspense fallback={loading}>
            <RouterProvider router={router} />
          </Suspense>{' '}
        </ModalsProvider>
        <Notifications />
      </MantineProvider>{' '}
      {/* </CloudinaryContext> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
