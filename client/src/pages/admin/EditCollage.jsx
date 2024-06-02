import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
// import { CButton, CCol, CRow } from '@coreui/react'
import Model from '../../stories/components/Model'
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
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { useForm } from '@mantine/form'
import { TextInput, Button, Group, Box, Modal } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMutation } from '@tanstack/react-query'
import customFetch from '../../utils/customFetch'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useCreateElement, useUpdateElement } from '../crud'

export default function EditCollage({ queryClient, data, component }) {
  const { mutateAsync: createCollage, isPending: isCreatingCollage } = useUpdateElement(
    queryClient,
    ['collages'],
  )
  // const te = useCreateElement(queryClient)
  const [opened, { open, close }] = useDisclosure(false)
  // console.log(isCreatingCollage)
  // console.log('isCreatingCollage')
  const form = useForm({
    initialValues: {
      name: data.name,
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
      const res = await createCollage({...data, ...values})
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
      <Modal centered={true} title="تعديل الكلية" opened={opened} onClose={close}>
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
            <Group position="right" mt="md">
              <Button type="submit">{isCreatingCollage ? 'Creating...' : 'إنشاء'}</Button>
            </Group>
          </form>
        </>
      </Modal>
      <Group onClick={open}>{component}</Group>
    </Group>
  )
}
