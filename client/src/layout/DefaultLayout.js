import React, { useEffect, Suspense, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Navigate, Route, Routes, useNavigate, Outlet } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import getRoutes from '../routes'
const DefaultLayout = () => {
  const [sidebarState, setSidebarState] = useState({
    sidebarShow: true,
    sidebarUnfoldable: false,
  })
  const routes = getRoutes()
const stateChange=(state)=>{
  setSidebarState((prev)=>({...prev, ...state}))
  console.log('sidebarState',state)
}
  return (
    <div>
      <AppSidebar sidebarShow={sidebarState} stateChange={stateChange}/>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader sidebarShow={sidebarState} stateChange={stateChange}/>
        <div className="body flex-grow-1 px-3">
          <CContainer lg>
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
