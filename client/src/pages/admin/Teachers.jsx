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

export default function Teachers({ queryClient }) {
  //call CREATE hook
  const { id: collageId } = useParams()
  const { mutateAsync: createTeacher, isLoading: isCreatingTeacher } = useCreateElement(
    queryClient,
    ['teachers'],
  )

  const {
    data: teachers = [],
    isError: isLoadingTeachersError,
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['teachers']))
 
  // console.log(teachers)
  const { mutateAsync: updateTeacher, isLoading: isUpdatingTeacher } = useUpdateElement(
    queryClient,
    ['teachers'],
  )
  const { mutateAsync: deleteTeacher, isLoading: isDeletingTeacher } = useDeleteElement(
    queryClient,
    ['teachers'],
  )

  const teachersForSelect = getMultiSelectData(teachers)
  const [editingRowData, setEditingRowData] = useState({}) // State for new row data

  const handleCreateTeacher = async ({ values, row, table, exitCreatingMode }) => {
    // console.log(newRowData)
    await createTeacher({ ...newRowData, collage: collageId })
    modals.closeAll()
    table.setCreatingRow(false)
  }

  const [newRowData, setNewrowData] = useState({  }) // State for new row data

  //UPDATE action
  const handleSaveTeacher = async ({ values, row, table }) => {
    await updateTeacher({ ...values, ...editingRowData, _id: row.id })
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row) => deleteTeacher(row.id)

  const columns = useMemo(
    () => [
      {
        id: 'index',
        enableEditing: false,
        accessorFn: (row, rowIndex) => rowIndex + 1,
        header: '#',
      },
      {
        accessorFn: (row) => `${row.name}`,
        id: 'name',
        header: 'الأسم',
      },
      {
        accessorKey: 'subtitle',
        id: 'subtitle',
        header: 'الأسم',
      },
      {
        accessorKey: 'category',
        id: 'category',
        header: 'الأسم',
      },

      {
        id: 'teachers',
        accessorKey: 'teachers',
        // accessorFn: (row) => row?.teachers?.map((sub) => <Badge>{`${sub.name} `}</Badge>) || '',
        Cell: ({ cell }) => {
          if (!cell.getValue() || cell.getValue().length == 0) return ''
          return cell.getValue()?.map((sub) => <Badge>{`${teachers[sub]?.name ?? ''} `}</Badge>)
        },
        enableEditing: true,
        header: 'المواد',
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: teachers,
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
    mantineToolbarAlertBannerProps: isLoadingTeachersError
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

    onCreatingRowSave: handleCreateTeacher,
    onEditingRowSave: handleSaveTeacher,
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
        <Title order={5}>My Custom Edit Modal</Title>
        <TextInput
          withAsterisk
          label="الأسم"
          name="name"
          id="name"
          placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...newRowData, name: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="subtitle"
          name="subtitle"
          id="subtitle"
          placeholder=" subtitle"
          onChange={(e) => setNewrowData({ ...newRowData, subtitle: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="category"
          name="category"
          id="category"
          placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...newRowData, category: e.target.value })}
        />
        <MultiSelect
          data={teachersForSelect}
          label="Your favorite frameworks/libraries"
          placeholder="Pick all that you like"
          defaultValue={row?.getAllCells()[5]?.getValue()}
          name="teachers"
          id="teachers"
          onChange={(selectedValue) =>
            setEditingRowData({ ...newRowData, teachers: selectedValue })
          }
        />
        <Flex justify="flex-end">
          <MRT_EditActionButtons row={row} table={table} variant="text" />{' '}
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ internalEditComponents, row, table }) => (
      <Stack>
        <Title order={5}>My Custom Edit Modal</Title>
        <TextInput
          withAsterisk
          label="الأسم"
          name="name"
          id="name"
          placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...editingRowData, name: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="subtitle"
          name="subtitle"
          id="subtitle"
          placeholder=" subtitle"
          onChange={(e) => setNewrowData({ ...editingRowData, subtitle: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="category"
          name="category"
          id="category"
          placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...editingRowData, category: e.target.value })}
        />
        <MultiSelect
          data={teachersForSelect}
          label="Your favorite frameworks/libraries"
          placeholder="Pick all that you like"
          defaultValue={row?.getAllCells()[5]?.getValue()}
          name="teachers"
          id="teachers"
          onChange={(selectedValue) =>
            setEditingRowData({ ...editingRowData, teachers: selectedValue })
          }
        />
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
        Create New User
      </Button>
    ),

    renderRowActionMenuItems: ({ row }) => (
      <Box>
        <ActionIcon
        // onClick={() => setEditingRowData({ teachers: row.getAllCells()[2].getValue() })}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon onClick={() => console.info('Delete')}>{/* <DeleteI /> */}</ActionIcon>
      </Box>
    ),
    state: {
      isLoading: isLoadingTeachers,
      isSaving: isCreatingTeacher || isUpdatingTeacher,
      showAlertBanner: isLoadingTeachersError,
      showProgressBars: isFetchingTeachers,
    },
  })

  return <MantineReactTable table={table} />
}

const getMultiSelectData = (teachers) =>
  Object.values(teachers).map((sub) => ({ value: sub._id, label: sub.name }))

const getSelectedValues = (elements, ids) => {
  const filterdElements = elements.filter((val) => ids.includes(val.value))
  console.log('filterdElements', filterdElements)
  return filterdElements
}
