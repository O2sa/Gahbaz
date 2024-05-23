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
import { useForm } from '@mantine/form'
import {
  TextInput,
  Button,
  Group,
  Box,
  Modal,
  NumberInput,
  MultiSelect,
  Avatar,
  Text,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMutation, useQuery } from '@tanstack/react-query'
import customFetch from '../../utils/customFetch'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useCreateElement, useGetElements } from '../crud'
import { useParams } from 'react-router-dom'
import { AiFillBank } from 'react-icons/ai'

import { forwardRef } from 'react'
import { getCurrentTime } from '../../../../utils/constants'

import 'dayjs/locale/ar-sa'
import { DatePickerInput } from '@mantine/dates'
import dayjs from 'dayjs' // Import dayjs
import { IconCalendar } from '@tabler/icons-react'

export default function StartSemester({ children, queryClient }) {
  const {
    data: collages = [],
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['collages']))

  const { mutateAsync: createSemesters, isPending: isCreatingSemesters } = useCreateElement(
    queryClient,
    ['semesters'],
  )

  const collagesForMultiselect = getMultiSelectData(collages)

  // const te = useCreateElement(queryClient)
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      collages: [],
      startDate: new Date(),
      endDate: null,
    },

    // validate: (values) => {
    //   const errors = {}
    //   if (!values.endDate) {
    //     errors.endDate = 'Please enter a name for the collage.'
    //   }
    //   if (values.collages.length == 0) {
    //     errors.collages = 'Please enter a name for the collage.'
    //   }
    //   return errors
    // },

    validate: {
      collages: (value, values) => (value.length == 0 ? 'Passwords did not match' : null),
      endDate: (value, values) =>
        value < values.startDate || !value ? 'Passwords did not match' : null,
    },
  })

  console.log(form.values)
  console.log(form.errors)

  const handleCloseModal = () => {
    close()
    form.reset() // Reset
  }

  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      const res = await createSemesters({
        collages: values.collages,
        semesterData: { startDate: values.startDate, endDate: values.endDate },
      })
      console.log(res)
      handleCloseModal()
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

  const SelectItem = forwardRef(({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <AiFillBank size="2.125rem" />
        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  ))

  return (
    <Group position="center">
      <Modal
        sx={{ overflow: 'inherit' }}
        size={'xl'}
        centered={true}
        title="بدا فصل جديد"
        opened={opened}
        onClose={close}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <MultiSelect
            label=" الكليات"
            name="collages"
            placeholder="اختر الكليات المراد بدأ فصولها "
            itemComponent={SelectItem}
            data={collagesForMultiselect}
            {...form.getInputProps('collages')}
            searchable
            nothingFound="Nobody here"
            // error={form.errors.collages}
            maxDropdownHeight={400}
          />
          <DatePickerInput
            label="تاريخ البداية"
            //   value={startDate}
            icon={<IconCalendar size="1.1rem" stroke={1.5} />}
            //   onChange={(date) => setStartDate(date)}
            {...form.getInputProps('startDate')}
            disabled={true}
          />{' '}
          <DatePickerInput
            icon={<IconCalendar size="1.1rem" stroke={1.5} />}
            label="تاريخ النهاية"
            placeholder="اختر تاريخ النهاية"
            dropdownType="modal"
            {...form.getInputProps('endDate')}
            format="YYYY-MM-DD"
            clearable
          />
          <Group position="right" mt="md">
            <Button type="submit">{isCreatingSemesters ? 'Creating...' : 'إنشاء'}</Button>
          </Group>
        </form>
      </Modal>
      <Group onClick={open}>{children}</Group>
    </Group>
  )
}

const getMultiSelectData = (elements) =>
  elements.map((ele) => ({
    value: ele._id,
    label: ele.name,
    description: `عدد الفصول لكل تخصص: ${ele.numberOfSemesters}`,
  }))
