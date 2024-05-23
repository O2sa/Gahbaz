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
} from '@mantine/core'
import customFetch from '../../utils/customFetch'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'

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
      await customFetch.post('/auth/register', values);
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
      <Title ta="center">Welcome back!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            mt="md"
            {...form.getInputProps('lastName')}
          />
          <NumberInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            mt="md"
            {...form.getInputProps('phone')}
          />
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
          <Button type='submit' fullWidth mt="xl" size="md">
            Login
          </Button>
        </form>
        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor href="#" fw={700} onClick={(event) => event.preventDefault()}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </Container>
  )
}
