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
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import customFetch from '../../utils/customFetch'
import { notifications } from '@mantine/notifications'

const Login = () => {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  })

  console.log(form.values)

  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      await customFetch.post('/auth/login', values)
      navigate('/')

      notifications.show({
        id: 'collage-created',
        title: 'Success!',
        message: 'Semesters created successfully!',
        variant: 'success',
        autoClose: 5000,
      })
    } catch (error) {
      notifications.show({
        id: 'collage-creation-error',
        title: 'Error!',
        message: error?.response?.data?.msg || 'An error occurred while creating the collage.',
        variant: 'danger',
        autoClose: 5000,
      })
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={form.onSubmit(handleSubmit)}>
          
                    <TextInput
                      label="Email address"
                      placeholder="hello@gmail.com"
                      size="md"
                      mt="md"
                      {...form.getInputProps('email')}
                    />
                  
                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      mt="md"
                      size="md"
                      {...form.getInputProps('password')}
                    />{' '}
                    {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
                    <Button type="submit" fullWidth mt="xl" size="md">
                      Login
                    </Button>
                  </form>
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
