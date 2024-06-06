import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { SpecialCard } from '../components/Specialcard'
// import { CButton, CCol, CRow } from '@coreui/react'
import Model from '../../stories/components/Model'

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
  List,
  ThemeIcon,
  Checkbox,
  Stack,
  Title,
} from '@mantine/core'

import { SpotlightProvider, spotlight } from '@mantine/spotlight'
import { IconHome, IconDashboard, IconFileText, IconSearch } from '@tabler/icons-react'

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
    data: majors = [],
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['majors']))

  const { mutateAsync: createSemesters, isPending: isCreatingSemesters } = useCreateElement(
    queryClient,
    ['semesters'],
  )

  const majorsForMultiselect = getMultiSelectData(majors)

  // const te = useCreateElement(queryClient)
  const [opened, { open, close }] = useDisclosure(false)
  const selectedItms = {}
  for (const temp in majorsForMultiselect) {
    selectedItms[temp] = new Set()
  }
  const [selectedSemesters, setSelectedSemesters] = useState(selectedItms)

  // console.log(selectedSemesters)
  const form = useForm({
    initialValues: {
      majors: [],
      templates: [],
      startDate: new Date(),
      endDate: null,
    },

    // validate: (values) => {
    //   const errors = {}
    //   if (!values.endDate) {
    //     errors.endDate = 'Please enter a name for the major.'
    //   }
    //   if (values.majors.length == 0) {
    //     errors.majors = 'Please enter a name for the major.'
    //   }
    //   return errors
    // },

    validate: {
      majors: (value, values) => (value.length == 0 ? 'Passwords did not match' : null),
      endDate: (value, values) =>
        value < values.startDate || !value ? 'Passwords did not match' : null,
    },
  })
  const jj = new Set()

  console.log(form.values)
  // console.log(form.errors)

  const handleCloseModal = () => {
    close()
    form.reset() // Reset
  }

  const handleSubmit = async (values) => {
    let semeters = []
    Object.keys(selectedSemesters).map((val) => {
      semeters = [...semeters, ...selectedSemesters[val]]
    })
    console.log('semeters', semeters)

    try {
      const res = await createSemesters({
        semesters: semeters,
        semesterData: { startDate: values.startDate, endDate: values.endDate },
      })

      handleCloseModal()
      notifications.show({
        id: 'major-created',
        title: 'Success!',
        message: 'Semesters created successfully!',
        variant: 'success',
        autoClose: 5000,
      })
    } catch (error) {
      notifications.show({
        id: 'major-creation-error',
        title: 'Error!',
        message: error?.response?.data?.msg || 'An error occurred while creating the major.',
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

  const ValueComponent = ({ item, ...others }) => {
    const templates = item.semesterTemplates.map((val) => val._id)
    // form.setValues({ ...form.values, templates: { ...form.values.templates, ...templates } })
    return (
      <Box>
        <Group mb={'md'} key={item._id} noWrap>
          <AiFillBank size="2.125rem" />
          <div>
            <Text>{item.label}</Text>
            <Text size="xs" color="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
        <Checkbox.Group
          defaultValue={[...selectedSemesters[item._id]]}
          label="اختر الفصول المراد بدأها:"
          // description="This is anonymous"
          // {...form.getInputProps('templates')}
          onChange={(e) =>
            setSelectedSemesters((prev) => ({
              ...prev,
              [item._id]: new Set(e),
            }))
          }
          withAsterisk
        >
          <Stack mt="xs">
            {item.semesterTemplates.map((val) => (
              <Checkbox value={val._id} label={val.name} />
            ))}
          </Stack>
        </Checkbox.Group>
      </Box>
    )
  }

  return (
    <Group position="center">
      <Modal
        keepMounted={false}
        sx={{ overflow: 'inherit' }}
        size={'xl'}
        centered={true}
        title="بدا فصل جديد"
        opened={opened}
        onClose={close}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <MultiSelect
            p={'md'}
            h={'auto'}
            label="التخصصات"
            name="majors"
            placeholder="اختر التخصصات المراد بدأ فصولها "
            itemComponent={SelectItem}
            // valueComponent={ValueComponent}
            data={Object.values(majorsForMultiselect)}
            {...form.getInputProps('majors')}
            searchable
            nothingFound="لا يوجد أي تخصصات"
            // error={form.errors.majors}
            maxDropdownHeight={400}
          />

          {form.values.majors.length > 0 ? (
            <>
              <Title order={4}> التخصصات المختارة:</Title>

              <Group h={300} m={'lg'} sx={{ overflowY: 'scroll', gap: 24 }} align="flex-start">
                {form.values.majors.map((val) => (
                  <ValueComponent item={majorsForMultiselect[val]} />
                ))}
              </Group>
            </>
          ) : null}

          <Group my={'md'} grow>
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
          </Group>

          <Group position="right" mt="md">
            <Button type="submit">{isCreatingSemesters ? 'Creating...' : 'إنشاء'}</Button>
          </Group>
        </form>
      </Modal>
      <Group onClick={open}>{children}</Group>
    </Group>
  )
}

function SelectTemplates({ item, selectedSemesters, setSelectedSemesters }) {
  // const te = useCreateElement(queryClient)
  const [opened, { open, close }] = useDisclosure(false)
  const selectedItms = {}
  for (const temp in majorsForMultiselect) {
    selectedItms[temp] = new Set()
  }

  const ValueComponent = ({ ...others }) => {
    const templates = item.semesterTemplates.map((val) => val._id)
    // form.setValues({ ...form.values, templates: { ...form.values.templates, ...templates } })
    return (
      <Box>
        <Group key={item._id} noWrap>
          <AiFillBank size="2.125rem" />
          <div>
            <Text>{item.label}</Text>
            <Text size="xs" color="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
        <Checkbox.Group
          defaultValue={selectedSemesters[item._id]}
          // label="حدد صلاحيات المدير:"
          // description="This is anonymous"
          // {...form.getInputProps('templates')}
          onChange={(e) =>
            setSelectedSemesters((prev) => ({
              ...prev,
              [item._id]: e,
            }))
          }
          withAsterisk
        >
          <Stack mt="xs">
            {item.semesterTemplates.map((val) => (
              <Checkbox value={val._id} label={val.name} />
            ))}
          </Stack>
        </Checkbox.Group>
      </Box>
    )
  }

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
        <Group my={'md'} grow>
          <ValueComponent />
        </Group>

        <Group position="right" mt="md">
          <Button type="submit">{isCreatingSemesters ? 'Creating...' : 'إنشاء'}</Button>
        </Group>
      </Modal>
      <Group onClick={open}>{children}</Group>
    </Group>
  )
}

const getMultiSelectData = (elements = []) => {
  const objs = {}
  elements.forEach((ele) => {
    objs[ele._id] = {
      ...ele,
      value: ele._id,
      label: ele.name,
      description: `عدد الفصول: ${ele?.semesterTemplates?.length}`,
    }
  })
  return objs
}
