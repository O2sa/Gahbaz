import {
  Avatar,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Group,
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

  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      await customFetch.post(`users/${user._id}`, values)

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

  return (
    <Container fluid>
      <Container
        bg="white"
        sx={{
          background: 'ligth',
        }}
        h={180}
        fluid
        mb={34}
      >
        <Flex gap={'md'} justify={'space-between'} h={'100%'}  align={'center'}>
          <Group noWrap sx={{}}>
            <Avatar size={'xl'} variant="outline" sx={{ borderRadius: '50%' }} src={user.avatar} />
            <div>
              <Text>{'أحمد قاسم'}</Text>
              <Text size="xs" color="dimmed">
                {'ظالب علوم حاسب، الفصل الرابع'}
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
            <Grid justify="space-between"   w={'100%'}>
              <Grid.Col w span={9}>
                <Group noWrap>
                  <TextInput
                    mt={'-1'}
                    w={'50%'}
                    error={form.errors.name}
                    placeholder="الاسم الاول"
                    label="الاسم"
                    {...form.getInputProps('firstName')}
                    withAsterisk
                  />
                  <TextInput
                    w={'50%'}
                    error={form.errors.name}
                    placeholder="الاسم الاخير"
                    label=" "
                    {...form.getInputProps('lastName')}
                    withAsterisk
                  />
                </Group>
                <TextInput
                  w={'100%'}
                  placeholder="lenumberOfSemestersvels"
                  label="الايميل"
                  {...form.getInputProps('email')}
                  withAsterisk
                  m={4}
                />
                <TextInput
                  w={'100%'}
                  error={form.errors.name}
                  placeholder="lenumberOfSemestersvels"
                  label="رقم الهاتف"
                  {...form.getInputProps('phone')}
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col p={16} sx={{ alignContent: 'center' }} bg={'gray'} span={2}>
                <Center h={'70%'}>
                  <Avatar h={'100%'} w={'100%'} size={'xl'} variant="outline" src={user.avatar} />
                </Center>
                <Center mt={4}>
                  <UploadProfile queryClient={queryClient} user={user.avatar}>
                    <Button size="xs" color="dark" rightIcon={<IconUpload />} variant="subtle">
                      رفع صورة
                    </Button>
                  </UploadProfile>
                </Center>
              </Grid.Col>
            </Grid>
          </Group>

          <Button type="submit" mt={34} size="lg">
            حفظ{' '}
          </Button>
        </form>
      </Container>
      <Group bg="white" py={34} px={16} w={400}>
        <form onSubmit={passform.onSubmit(passhandleSubmit)}>
          <Text>{' تغيير كلمة السر'}</Text>
          <Group mt={2} sx={{}}>
            <TextInput
              w={'100%'}
              placeholder="كلمة السر القديمة"
              label="كلمة السر القديمة"
              {...form.getInputProps('oldPassword')}
              withAsterisk
            />
            <TextInput
              w={'100%'}
              placeholder=""
              label="كلمة السر الجديدة"
              {...form.getInputProps('password')}
              withAsterisk
            />{' '}
            <TextInput
              w={'100%'}
              placeholder="كرر كلمة السر"
              label="كلمة السر الجديدة"
              {...form.getInputProps('confirmPassword')}
              withAsterisk
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
