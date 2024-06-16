import React, { useState } from 'react'
import axios from 'axios'

import { Link, Form, redirect, useNavigate } from 'react-router-dom'

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Center,
  Image,
  Menu,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import customFetch from '../../utils/customFetch'
import { notifications } from '@mantine/notifications'
import logo from '../../assets/brand/Logo.svg'
import { PiChalkboardTeacher, PiChalkboardTeacherDuotone, PiStudentBold } from 'react-icons/pi'
import { RiAdminFill } from 'react-icons/ri'
import { Helmet } from 'react-helmet'

const Login = ({}) => {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  })

  // console.log(form.values)

  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      const { data } = await customFetch.post('/auth/login', values)
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
    <Container size={420} my={40}>
        <Helmet>
        <title>{ 'منصة جهبذ | تسجيل الدخول' }</title>
      </Helmet>
      <Center mb={'xl'}>
        <Image width={'75%'} src={logo} />
      </Center>
      <Title ta="center">أهلا بك!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        لم تُنشأ حساب بعد؟ <Link to={'/register'}>إنشاء حساب</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="الايميل"
            placeholder="الايميل"
            size="md"
            mt="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="كلمة السر"
            placeholder="كلمة السر"
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />{' '}
          <Group justify="space-between" mt="lg">
            <Anchor component="button" size="sm">
              نسيت كلمة السر؟
            </Anchor>
          </Group>{' '}
          <Group align="center" j>
            <Button type="submit" fullWidth mt="xl" size="md">
              تسجيل
            </Button>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Center m={'lg'}>
                <Anchor variant="light">تجربة المنصة</Anchor>
              </Center>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>تجربة المنصة بحساب:</Menu.Label>
              <Menu.Item
                onClick={() =>
                  handleSubmit({ password: 'student@test.com', email: 'student@test.com' })
                }
                icon={<PiStudentBold size={14} />}
              >
                طالب
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  handleSubmit({ password: 'teacher@tech.com', email: 'teacher@tech.com' })
                }
                icon={<PiChalkboardTeacherDuotone size={14} />}
              >
                معلم
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  handleSubmit({ password: 'admin@test.com', email: 'admin@test.com' })
                }
                icon={<RiAdminFill size={14} />}
              >
                مدير
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </form>
      </Paper>
    </Container>
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
