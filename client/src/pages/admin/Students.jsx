import { useMemo, useEffect, useState } from 'react'
import {
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
  MantineReactTable,
  useMantineReactTable,
  MRT_EditActionButtons,
} from 'mantine-react-table'
import { Link, useLoaderData, useParams } from 'react-router-dom'

// import useTable
import {
  ActionIcon,
  Button,
  Flex,
  Text,
  Tooltip,
  Title,
  Box,
  Menu,
  Badge,
  MantineProvider,
  Anchor,
  Stack,
  TextInput,
  MultiSelect,
  Select,
} from '@mantine/core'
import { IconUserCircle, IconSend } from '@tabler/icons-react'
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useCreateElement, useDeleteElement, useGetElements, useUpdateElement } from '../crud'
import { modals } from '@mantine/modals'

export default function Students({ queryClient }) {
  //call CREATE hook
  const { id: collageId } = useParams()
  const { mutateAsync: createStudent, isLoading: isCreatingStudent } = useCreateElement(
    queryClient,
    ['students'],
  )

  const {
    data: students = [],
    isError: isLoadingStudentsError,
    isFetching: isFetchingStudents,
    isLoading: isLoadingStudents,
  } = useQuery(useGetElements(['students']))
  const {
    data: majors = [],
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['majors']))

  // console.log(students)
  const { mutateAsync: updateStudent, isLoading: isUpdatingStudent } = useUpdateElement(
    queryClient,
    ['students'],
  )
  const { mutateAsync: deleteStudent, isLoading: isDeletingStudent } = useDeleteElement(
    queryClient,
    ['students'],
  )

  const majorsForSelect = getMultiSelectData(majors)
  const [editingRowData, setEditingRowData] = useState({}) // State for new row data

  const handleCreateStudent = async ({ values, row, table, exitCreatingMode }) => {
    // console.log(newRowData)
    await createStudent({ ...newRowData })
    modals.closeAll()
    table.setCreatingRow(false)
  }

  const [newRowData, setNewrowData] = useState({}) // State for new row data

  //UPDATE action
  const handleSaveStudent = async ({ values, row, table }) => {
    await updateStudent({ ...values, ...editingRowData, _id: row.id })
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row) => deleteStudent(row.id)

  const columns = useMemo(
    () => [
      {
        id: 'index',
        enableEditing: false,
        accessorFn: (row, rowIndex) => rowIndex + 1,
        header: '#',
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'الأسم',

        Cell: ({ cell, row }) => {
          return `${row.original.firstName} ${row.original.lastName}`
        },
      },

      {
        accessorKey: 'email',
        header: 'الأسم',
      },
      {
        accessorKey: 'phone',
        header: 'رقم الهاتف',
      },

      {
        accessorKey: 'comingSemester',
        header: 'الفصل القادم',
      },

      {
        accessorKey: 'major',
        Cell: ({ cell }) => {
          if (!cell.getValue()) return ''
          return cell.getValue().name
        },
        enableEditing: false,
        header: 'التخصص',
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: students,
    // enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    enableEditing: true,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableRowActions: true,
    getRowId: (row) => row._id,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },
    mantineToolbarAlertBannerProps: isLoadingStudentsError
      ? {
          color: 'red',
          children: 'خطأ في تحميل البيانات',
        }
      : undefined,
    mantineTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },

    onCreatingRowSave: handleCreateStudent,
    onEditingRowSave: handleSaveStudent,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="تعديل">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="حذف">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderCreateRowModalContent: ({ internalEditComponents, row, table }) => (
      <Stack>
        <Title order={5}>تعديل</Title>
        <TextInput
          withAsterisk
          label="الاسم الأول"
          name="firstName"
          id="firstName"
          placeholder="الاسم الأول"
          onChange={(e) => setNewrowData({ ...newRowData, name: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="الاسم الاخير"
          name="firstName"
          id="firstName"
          onChange={(e) => setNewrowData({ ...newRowData, lastName: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="رقم الهاتف"
          name="phone"
          id="phone"
          placeholder="الرقم"
          onChange={(e) => setNewrowData({ ...newRowData, phone: e.target.value })}
        />
        <TextInput
          withAsterisk
          label="الايميل"
          name="email"
          id="email"
          placeholder=" الايميل"
          onChange={(e) => setNewrowData({ ...newRowData, email: e.target.value })}
        />{' '}
        <Select
          data={majorsForSelect}
          label="التخصص"
          // placeholder="Pick all that you like"
          defaultValue={row?.getAllCells()[5]?.getValue()}
          name="major"
          id="major"
          onChange={(selectedValue) => setNewrowData({ ...newRowData, major: selectedValue })}
        />
        <Flex justify="flex-end">
          <MRT_EditActionButtons row={row} table={table} variant="text" />{' '}
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ internalEditComponents, row, table }) => (
      <Stack>
                <Title order={5}>تعديل</Title>

        <TextInput
          withAsterisk
          label="الاسم الأول"
          name="firstName"
          id="firstName"
          defaultValue={row?.original?.firstName}
          placeholder="الاسم الأول"
          onChange={(e) => setEditingRowData({ ...editingRowData, firstName: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="الاسم الاخير"
          name="lastName"
          defaultValue={row?.original?.lastName}
          id="lastName"
          onChange={(e) => setEditingRowData({ ...editingRowData, lastName: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="الايميل"
          name="email"
          id="email"
          defaultValue={row?.original?.email}
          placeholder=" الايميل"
          onChange={(e) => setEditingRowData({ ...editingRowData, email: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="الهاتف"
          name="phone"
          id="phone"
          placeholder="الهاتف"
          defaultValue={row?.original?.phone}
          onChange={(e) => setEditingRowData({ ...editingRowData, phone: e.target.value })}
        />
        {/* <MultiSelect
          data={majorsForSelect}
          label="المعلمون"
          // placeholder="Pick all that you like"
          defaultValue={row?.original?.major}
          name="major"
          id="teachers"
          onChange={(selectedValue) => setNewrowData({ ...newRowData, teachers: selectedValue })}
        /> */}
        <Flex justify="flex-end">
          <MRT_EditActionButtons row={row} table={table} variant="text" />{' '}
        </Flex>
      </Stack>
    ),
    mantineCreateRowModalProps: {
      centered: true,
      closeButtonProps: {},
      onClose: () => setNewrowData({}),
    },
    mantineEditRowModalProps: {
      centered: true,
      onClose: () => setEditingRowData({}),
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        إنشاء طالب جديد
      </Button>
    ),

    renderRowActionMenuItems: ({ row }) => (
      <Box>
        <ActionIcon
        // onClick={() => setEditingRowData({ students: row.getAllCells()[2].getValue() })}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon onClick={() => console.info('Delete')}>{/* <DeleteI /> */}</ActionIcon>
      </Box>
    ),
    state: {
      isLoading: isLoadingStudents,
      isSaving: isCreatingStudent || isUpdatingStudent,
      showAlertBanner: isLoadingStudentsError,
      showProgressBars: isFetchingStudents,
    },
  })

  return <MantineReactTable table={table} />
}

const getMultiSelectData = (students) =>
  Object.values(students).map((sub) => ({ value: sub._id, label: sub.name }))

const getSelectedValues = (elements, ids) => {
  const filterdElements = elements.filter((val) => ids.includes(val.value))
  console.log('filterdElements', filterdElements)
  return filterdElements
}
