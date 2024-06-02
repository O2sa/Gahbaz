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
  Group,
  Indicator,
  Avatar,
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
import { isUserActive } from '../../utils/UsersUtils'

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

  // const teachersForSelect = getMultiSelectData(teachers)
  const [editingRowData, setEditingRowData] = useState({}) // State for new row data

  const handleCreateTeacher = async ({ values, row, table, exitCreatingMode }) => {
    // console.log(newRowData)
    await createTeacher({ ...newRowData, collage: collageId })
    modals.closeAll()
    table.setCreatingRow(false)
  }

  const [newRowData, setNewrowData] = useState({}) // State for new row data

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
        accessorKey: 'name',
        id: 'name',
        header: 'الأسم',
        enableEditing: false,

        Cell: ({ cell, row }) => {
          const item = row.original
          return (
            <Link to={'/users/' + item._id}>
              <Group gap="sm" noWrap>
                <Indicator disabled={!isUserActive(row.original.lastActivity)}>
                  <Avatar  size={40} src={item.avatar} radius={40} />
                </Indicator>
                <div>
                  <Text fz="sm" fw={500}>
                    {`${item.firstName} ${item.lastName}`}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    {item.email}
                  </Text>
                </div>
              </Group>
            </Link>
          )
        },
      },

      {
        accessorKey: 'email',
        id: 'email',
        header: 'الإيميل',
        enableEditing: false ,

      },

      {
        accessorKey: 'phone',
        id: 'phone',
        enableEditing: false ,

        header: 'رقم الهاتف',
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
          label="الاسم الأول"
          name="firstName"
          id="firstName"
          placeholder="الاسم الأول"
          onChange={(e) => setNewrowData({ ...newRowData, firstName: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="الاسم الاخير"
          name="lastName"
          id="lastName"
          onChange={(e) => setNewrowData({ ...newRowData, lastName: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="الايميل"
          name="email"
          id="email"
          placeholder=" الايميل"
          onChange={(e) => setNewrowData({ ...newRowData, email: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="الهاتف"
          name="phone"
          id="phone"
          placeholder="الهاتف"
          onChange={(e) => setNewrowData({ ...newRowData, phone: e.target.value })}
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
        إنشاء مستخدم جديد
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
      isSaving: isCreatingTeacher || isUpdatingTeacher || isDeletingTeacher,
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
