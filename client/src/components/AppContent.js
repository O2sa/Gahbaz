import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import getRoutes from '../routes'

const AppContent = () => {
  // let navigate = useNavigate()
  // useEffect(() => {
  //   const User =
  //     localStorage.getItem('user') !== 'undefined'
  //       ? JSON.parse(localStorage.getItem('user'))
  //       : localStorage.clear()

  //   if (!User) navigate('/login')
  // }, [])
  const routes = getRoutes()
  console.log(routes)
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
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
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
