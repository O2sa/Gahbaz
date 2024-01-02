import React, { useState } from 'react'
import axios from 'axios'

import { Link, Form, redirect, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const nev = useNavigate()

  const [user, setUser] = useState('')
  const submitHandler = (e) => {
    e.preventDefault()
    // Dispatch login
    console.log(user)
    // localStorage.setItem('user', user)

    // redirect(`/dashboard`)

    login(user, nev)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm method="post">
                    <h1>تسجيل الدخول</h1>
                    <p className="text-medium-emphasis">قم بتسجيل الدخول، لتصل إلى حسابك</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="الإيميل"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="كلمة السر"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          onClick={submitHandler}
                          type="submit"
                          color="primary"
                          className="px-4"
                        >
                          تسجيل
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          هل نسيت كلمة السر?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>إنشاء حساب</h2>
                    <p>إذا لم يكن لديك حساب فقم بإنشاء حساب جديد</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        إنشاء!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

async function login(request, nev) {
  console.log(request)
  localStorage.setItem('user', request)

  nev(`/dashboard`)

  // try {
  //   const config = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }

  //   // Make post request to log
  //   const { data } = await axios.get('/api/v1/admin/users')
  //   console.log(data)

  //   // Set user to local storage
  //   // localStorage.setItem('userInfo', JSON.stringify(data))
  // } catch (error) {
  //   console.log(error)
  // }
}
export default Login
