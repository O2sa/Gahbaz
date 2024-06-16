import {
  Avatar,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core'
import react, { useState } from 'react'
import avtar from '../../assets/images/avatars/1.jpg'
import { Link } from 'react-router-dom'
import { IconArrowAutofitLeft } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { IconUpload } from '@tabler/icons-react'
import UploadProfile from './UploadProfile'
import { useDashboardContext } from '../../layout/DefaultLayout'
import customFetch from '../../utils/customFetch'
import { notifications } from '@mantine/notifications'
import { ChatContactsLoader } from '../LoadingComponents'
import { Helmet } from 'react-helmet'

export default function Profile({ queryClient }) {
  const { user } = useDashboardContext()
  const form = useForm({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      avtar: user.avatar,
      email: user.email,
      phone: user.phone,
    },

    validate: (values) => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Please enter a name for the collage.'
      }
      return errors
    },
  })
  const passform = useForm({
    initialValues: {
      password: '',
      oldPassword: '',
      confirmPassword: '',
    },
  })

  console.log(form.values)
  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      await customFetch.patch(`users/${user._id}`, form.values)

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
  const passhandleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      await customFetch.post(`users/${user._id}/change-pass`, values)

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

  const getRole = () => {
    if (user.__t === 'Student') return `طالب ${user.major.name}, الفصل ${user.comingSemester}`
    if (user.__t === 'Teatcher') return `معلم`
    if (user.__t === 'Admin') return `مدير`
  }

  return (
    <Container fluid>
                 <Helmet>
            <title>{ 'منصة جهبذ |  الملف الشخصي' }</title>
      </Helmet>
      <Container
        bg="white"
        sx={{
          background: 'ligth',
        }}
        h={180}
        fluid
        mb={34}
      >
        <Flex gap={'md'} justify={'space-between'} h={'100%'} align={'center'}>
          <Group noWrap sx={{}}>
            <Avatar size={'xl'} variant="outline" sx={{ borderRadius: '50%' }} src={user.avatar} />
            <div>
              <Text>{`${user.firstName} ${user.lastName}`}</Text>
              <Text size="xs" color="dimmed">
                {getRole()}
              </Text>
            </div>
          </Group>
          <Link to={'/'}>
            <Button
              size="lg"
              variant="light"
              // leftIcon={<IconInfoCircle size={14} />}
              rightIcon={<IconArrowAutofitLeft size={14} />}
            >
              عودة
            </Button>
          </Link>
        </Flex>
      </Container>
      <Container
        bg="white"
        py={34}
        sx={
          {
            //   background: 'ligth',
          }
        }
        // h={'auto'}
        pt={4}
        fluid
        mb={34}
      >
        <Text>{'المعلومات الشخصية'}</Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group mt={5} noWrap sx={{}}>
            <Grid gutterXs={'lg'} align="space-between" justify="space-between" w={'100%'}>
              <Grid.Col xs={12} md={9}>
                <Group noWrap>
                  <TextInput
                    my={4}
                    size="md"
                    w={'50%'}
                    placeholder="الاسم الاول"
                    label="الاسم"
                    {...form.getInputProps('firstName')}
                    withAsterisk
                  />
                  <TextInput
                    w={'50%'}
                    my={12}
                    placeholder="الاسم الاخير"
                    size="md"
                    label=" "
                    {...form.getInputProps('lastName')}
                    withAsterisk
                  />
                </Group>
                <TextInput
                  w={'100%'}
                  size="md"
                  placeholder="lenumberOfSemestersvels"
                  label="الايميل"
                  {...form.getInputProps('email')}
                  withAsterisk
                  my={12}
                />
                <TextInput
                  w={'100%'}
                  size="md"
                  error={form.errors.name}
                  placeholder="lenumberOfSemestersvels"
                  label="رقم الهاتف"
                  {...form.getInputProps('phone')}
                  withAsterisk
                  my={12}
                />
              </Grid.Col>
              <Grid.Col
                p={16}
                sx={{ alignContent: 'center', textAlign: 'center' }}
                bg={'gray'}
                // className='bg-secondary'
                xs={11}
                md={2}
              >
                <Center h={'70%'}>
                  <Avatar h={'100%'} w={'100%'} size={'xl'} variant="outline" src={user.avatar} />
                </Center>
                <Center mt={4}>
                  <UploadProfile queryClient={queryClient} user={user}>
                    <Button size="xs" color="dark" rightIcon={<IconUpload />} variant="subtle">
                      رفع صورة
                    </Button>
                  </UploadProfile>
                </Center>
              </Grid.Col>
            </Grid>
          </Group>

          <Flex m={12} justify={'flex-end'}>
            <Button onClick={handleSubmit} type="submit" mt={34} size="lg">
              حفظ{' '}
            </Button>
          </Flex>
        </form>
      </Container>
      <Group bg="white" py={34} px={16}  >
        <form onSubmit={passform.onSubmit(passhandleSubmit)}>
          <Text>{' تغيير كلمة السر'}</Text>
          <Group mt={2} sx={{}}>
            <PasswordInput
              size="md"
              w={'100%'}
              placeholder="كلمة السر القديمة"
              label="كلمة السر القديمة"
              name="oldPassword"
              {...passform.getInputProps('oldPassword')}
              withAsterisk
            />
            <PasswordInput
              w={'100%'}
              placeholder=""
              size="md"
              label="كلمة السر الجديدة"
              name="password"
              {...passform.getInputProps('password')}
              withAsterisk
            />
            <PasswordInput
              w={'100%'}
              size="md"
              placeholder="كرر كلمة السر"
              label="كلمة السر الجديدة"
              name="confirmPassword"
              {...passform.getInputProps('confirmPassword')}
            />
            <Button type="submit" fullWidth mt="xl" size="md">
              حفظ
            </Button>
          </Group>
        </form>
      </Group>
    </Container>
  )
}
