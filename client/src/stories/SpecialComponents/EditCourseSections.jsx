import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// import ReactQuill from 'react-quill'
// // import 'react-quill/dist/quill.snow.css'
// import { Editor } from 'react-draft-wysiwyg'
// import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import {
  CListGroup,
  CButton,
  CListGroupItem,
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CRow,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import { useForm } from '@mantine/form'
import {
  TextInput,
  Button,
  Group,
  Box,
  Modal,
  NumberInput,
  Center,
  Text,
  Title,
} from '@mantine/core'

import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { IoMdAdd } from 'react-icons/io'

import Model from '../components/Model'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { EditCourseSection } from './EditCourseSection'
import { useQuery } from '@tanstack/react-query'
import {
  useGetElements,
  useCreateElement,
  useUpdateElement,
  useDeleteElement,
} from '../../pages/crud'
import customFetch from '../../utils/customFetch'

export const EditCourseSections = ({ queryClient, ...props }) => {
  // const location=useLocation()
  const { courseId } = useParams()
  // console.log('courseId', id)

  const {
    data: sections = [],
    isError: isLoadingError,
    isFetching: isFetching,
    isLoading: isLoading,
    isSuccess: done,
  } = useQuery(useGetElements([`sections`, courseId]))

  if (isFetching) {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        Loading
      </div>
    )
  }

  return (
    <div className="m-4">
      <Title mb={'md'} order={3}>دروس الدورة</Title>


      {sections.length > 0 ? (
        <div>
          {sections.map((item, idx) => (
            <EditCourseSection idx={idx} key={idx} queryClient={queryClient} section={item} />
          ))}
        </div>
      ) : (
        <Center m={8}>لا يوجد أقسام بعد</Center>
      )}
      <div className="mx-2">
        <AddSection queryClient={queryClient}>
          {' '}
          <Button variant="light" sx={{ width: '100%' }} size="lg">
            إضافة قسم
          </Button>{' '}
        </AddSection>
      </div>
    </div>
  )
}

export function AddSection({ children, queryClient, edit = false, section }) {
  const { courseId } = useParams()
  const { mutateAsync: createSection, isPending: isCreatingCollage } = useCreateElement(
    queryClient,
    ['sections', courseId],
  )

  const { mutateAsync: updateSection, isPending: isUpdating } = useUpdateElement(queryClient, [
    'sections',
    courseId,
  ])

  // const te = useCreateElement(queryClient)
  const [opened, { open, close }] = useDisclosure(false)
  // console.log(isCreatingCollage)
  // console.log('isCreatingCollage')
  const form = useForm({
    initialValues: {
      name: edit ? section.name : '',
      course: courseId,
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
      if (!edit) await createSection(values)
      else await updateSection({ ...values, _id: section._id })
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
      <Modal centered={true} title="إنشاء قسم" opened={opened} onClose={close}>
        <>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {' '}
            <TextInput
              withAsterisk
              label="الأسم"
              name="name"
              placeholder="اسم القسم"
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
      <Group sx={{ width: '100%' }} onClick={open}>
        {/* <Button radius="xs">إنشاء قسم</Button> */}
        {children}
      </Group>
    </Group>
  )
}

export function DeleteSection({ children, sectionId, queryClient }) {
  const { courseId } = useParams()
  const { mutateAsync: deleteSection, isPending: isUpdating } = useDeleteElement(queryClient, [
    'sections',
    courseId,
  ])

  const handleSubmit = async () => {
    try {
      await deleteSection(sectionId)
      // handleCloseModal()
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
    <Group onClick={handleSubmit}>
      {/* <Button radius="xs">إنشاء قسم</Button> */}
      {children}
    </Group>
  )
}
export function DeleteLesson({ children, sectionId, queryClient, lessonId }) {
  const { id } = useParams()

  const handleSubmit = async (values) => {
    try {
      await customFetch.delete(`sections/${sectionId}/lessons/${lessonId}`)
      queryClient.invalidateQueries(['sections', id])
    } catch (error) {
      return error
    }
  }

  return (
    <Group onClick={handleSubmit}>
      {/* <Button radius="xs">إنشاء قسم</Button> */}
      {children}
    </Group>
  )
}

export function AddLesson({ children, sectionId, queryClient, edit = false, lesson }) {
  const { courseId } = useParams()

  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: edit ? lesson.name : '',
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
      if (edit) await customFetch.patch(`sections/${sectionId}/lessons/${lesson._id}`, values)
      else await customFetch.post(`sections/${sectionId}/lessons`, values)

      queryClient.invalidateQueries(['sections', courseId])
      handleCloseModal()
    } catch (error) {
      return error
    }
  }

  return (
    <Group position="center">
      <Modal centered={true} title="إنشاء قسم" opened={opened} onClose={close}>
        <>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {' '}
            <TextInput
              withAsterisk
              label="الأسم"
              name="name"
              placeholder="اسم القسم"
              error={form.errors.name}
              // errorMessage={form.errors.name}
              // onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              {...form.getInputProps('name')}
            />
            <Group position="right" mt="md">
              <Button type="submit"> إنشاء</Button>
            </Group>
          </form>
        </>
      </Modal>
      <Group onClick={open}>{children}</Group>
    </Group>
  )
}
