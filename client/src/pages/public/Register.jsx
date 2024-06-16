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
  NumberInput,
  Image,
  Center,
} from '@mantine/core'
import customFetch from '../../utils/customFetch'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { Link } from 'react-router-dom'
import logo from '../../assets/brand/Logo.svg'
import { Helmet } from 'react-helmet'

export default function Register() {
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      // firstName: '',
      // phone: '',
      // lastName: '',
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      await customFetch.post('/auth/register', values)
      navigate('/login')

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
            <title>{ 'منصة جهبذ |  الدورات' }</title>
      </Helmet>
      <Center mb={'xl'}>
        <Image width={'75%'} src={logo} />
      </Center>
      <Title ta="center">مرحبا بك في منصة جهبذ !</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        قم بإنشاء حسابك!{' '}
        {/* <Anchor size="sm" component="button">
          Create account
        </Anchor> */}
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="الاسم الاول"
            placeholder=""
            size="md"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="الاسم الاخير"
            placeholder=""
            size="md"
            mt="md"
            {...form.getInputProps('lastName')}
          />
          <NumberInput
            label="رقم الهاتف "
            placeholder=""
            size="md"
            mt="md"
            {...form.getInputProps('phone')}
          />
          <TextInput
            label="الايميل"
            placeholder=""
            size="md"
            mt="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="كلمة السر"
            placeholder=""
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />{' '}
          {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
          <Button type="submit" fullWidth mt="xl" size="md">
            إنشاء
          </Button>
        </form>
        <Text ta="center" mt="md">
          ألديك حساب بالفعل؟{' '}
          <Link to="/login" fw={700}>
            تسجيل الدخول
          </Link>
        </Text>
      </Paper>
    </Container>
  )
}
