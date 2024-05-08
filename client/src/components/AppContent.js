import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
// import { selectIsLesson } from 'src/dataLogic/ContinerState'
// routes config
import getRoutes from '../routes'

const AppContent = ({isLesson}) => {


  const routes = getRoutes()
  console.log(routes)
  return (
    <CContainer fluid={isLesson ? true : false} lg={!isLesson ? true : false}>
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
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
