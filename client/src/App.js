import React, { Component, Suspense, useEffect } from 'react'
import getRoutes, { getNestedRoutes, adminRoutes } from './routes'

import {
  HashRouter,
  Route,
  Routes,
  useNavigate,
  createBrowserRouter,
  RouterProvider,
  Router,
  createRoutesFromElements,
  Navigate,
  createHashRouter,
} from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./pages/login/Login'))
const Register = React.lazy(() => import('./pages/register/Register'))
const Page404 = React.lazy(() => import('./pages/page404/Page404'))
const Page500 = React.lazy(() => import('./pages/page500/Page500'))
// const router = createBrowserRouter(createRoutesFromElements())

//Admin
const ManageUsers = React.lazy(() => import('./admin/users'))
const CurrentTerm = React.lazy(() => import('./admin/CurrentTerm'))
const Dashboard = React.lazy(() => import('./admin/Dashboard'))

// console.log(adminRoutes)

const router = createBrowserRouter([
  { exact: true, path: '/login', name: 'Login Page', element: <Login /> },
  { exact: true, path: '/register', name: 'Register Page', element: <Register /> },
  { exact: true, path: '/404', name: 'Page 404', element: <Page404 /> },
  { exact: true, path: '/500', name: 'Page 500', element: <Page500 /> },
  {
    path: '/',
    name: 'Home',
    element: <DefaultLayout />,
    children: getRoutes(),
  },
])
console.log(router)

function App() {
  // let navigate = u seNavigate()
  // useEffect(() => {
  //   const User =
  //     localStorage.getItem('user') !== 'undefined'
  //       ? localStorage.getItem('user')
  //       : localStorage.clear()

  //   if (!User) navigate('/login')
  // }, [])
  return (
    <Suspense fallback={loading}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
// }



export default App
