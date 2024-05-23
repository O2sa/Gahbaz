import React, { useState } from 'react'

import { useForm } from '@mantine/form'
import { TextInput, Button, Group, Box, Modal, NumberInput } from '@mantine/core'

import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useCreateElement } from '../crud'

export default function AddCollage({ queryClient }) {
  const { mutateAsync: createCollage, isPending: isCreatingCollage } = useCreateElement(
    queryClient,
    ['collages'],
  )
  // const te = useCreateElement(queryClient)
  const [opened, { open, close }] = useDisclosure(false)
  // console.log(isCreatingCollage)
  // console.log('isCreatingCollage')
  const form = useForm({
    initialValues: {
      name: '',
      numberOfSemesters:0
    },

    validate: (values) => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Please enter a name for the collage.'
      }
      return errors
    },
  })

  const handleCloseModal = () => {
    close()
    form.reset() // Reset
  }

  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      const res = await createCollage(values)
      console.log(res)
      handleCloseModal()
      notifications.show({
        id: 'collage-created',
        title: 'Success!',
        message: 'Collage created successfully!',
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
    <Group position="center">
      <Modal centered={true} title="إنشاء كلية" opened={opened} onClose={close}>
        <>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {' '}
            <TextInput
              withAsterisk
              label="الأسم"
              name="name"
              placeholder="اسم الكلية"
              error={form.errors.name}
              // errorMessage={form.errors.name}
              // onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              {...form.getInputProps('name')}
            />
            <NumberInput
              error={form.errors.numberOfSemesters}
              label="عدد الفصول"
              placeholder="عدد الفصول"
              
              {...form.getInputProps('numberOfSemesters')}
              withAsterisk
            />
            <Group position="right" mt="md">
              <Button type="submit">{isCreatingCollage ? 'Creating...' : 'إنشاء'}</Button>
            </Group>
          </form>
        </>
      </Modal>
      <Group onClick={open}>
        <Button radius="xs">إنشاء كلية</Button>
      </Group>
    </Group>
  )
}
