import React, { Component, Suspense, useEffect } from 'react'

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

function App() {
  let navigate = useNavigate()
  useEffect(() => {
    const User =
      localStorage.getItem('user') !== 'undefined'
        ? localStorage.getItem('user')
        : localStorage.clear()

    if (!User) navigate('/login')
  }, [])
  return (
    <Suspense fallback={loading}>
      <Routes>
        <Route exact path="/login" name="Login Page" element={<Login />} />
        <Route exact path="/register" name="Register Page" element={<Register />} />
        <Route exact path="/404" name="Page 404" element={<Page404 />} />
        <Route exact path="/500" name="Page 500" element={<Page500 />} />
        <Route path="*" name="Home" element={<DefaultLayout />} />
      </Routes>
    </Suspense>
  )
}
// }

export default App
