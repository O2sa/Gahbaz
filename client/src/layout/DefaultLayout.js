import React, { useEffect, Suspense, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Navigate, Route, Routes, useNavigate, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useLocation } from 'react-router-dom'


// routes config
import getRoutes from '../routes'
const DefaultLayout = () => {
  const location = useLocation();

  // Define an array of paths that represent lessons
  const lessonPaths = ['/lessons', '/study',]; // Example paths for lessons

  // Check if the current path is a lesson path
  const isCurrentPathLesson = lessonPaths.some(path => location.pathname.includes(path));

  const [sidebarState, setSidebarState] = useState({
    sidebarShow: true,
    sidebarUnfoldable: false,
  })

  const routes = getRoutes()
  
  const stateChange = (state) => {
    setSidebarState((prev) => ({ ...prev, ...state }))
    console.log('sidebarState', state)
  }
  return (
    <div>
      <AppSidebar sidebarShow={sidebarState} stateChange={stateChange} />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader sidebarShow={sidebarState} stateChange={stateChange} />
        <div className="body flex-grow-1 px-3">
          <CContainer fluid={isCurrentPathLesson ? true : false} lg={!isCurrentPathLesson ? true : false}>
            <Suspense fallback={<CSpinner color="primary" />}>
              <Outlet />
            </Suspense>
          </CContainer>{' '}
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default DefaultLayout
