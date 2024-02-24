import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
// import { CButton, CCol, CRow } from '@coreui/react'
import Model from '../components/Model'
import {
  CCol,
  CRow,
  CForm,
  CFormControlValidation,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CFormFeedback,
  CFormCheck,
  CButton,
  CFormTextarea,
  CFormInput,
  CContainer,
  CSpinner,
} from '@coreui/react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  Link
} from 'react-router-dom'
import Collages from './Collages'
import CollageInfo from './CollageInfo'
import DefaultLayout from 'src/layout/DefaultLayout'
import App from 'src/App'
import { Provider } from 'react-redux'
import store from 'src/lib/store'

export const MainLayout = ({ comp, ...props }) => {
  const adminRoutes = [
    { index: true, name: 'لوحة التحكم', element: <Collages /> },
    { path: 'usersManagement', name: 'إدارة المستخدمين', element: <CollageInfo /> },
    // {
    //   path: 'collagesManagement',
    //   name: 'إدارة الكليات',
    //   element: <Collages />,
    //   // loader: collagesLoader,
    // },
    // { path: 'semesters', name: 'الفصول الدراسية', element: <adminSetting /> },
    // { path: '/base/accordion', name: 'الفصول الدراسية', element: <adminSetting /> },
  ]
  const router = createBrowserRouter([
    {
      path: '/',
      name: 'Home',
      element: <DefaultLayout />,
      children: adminRoutes,
    },
  ])

  return (
    <>
    <div>
      <h1>Links</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </div>
    </>
    
  )
}
