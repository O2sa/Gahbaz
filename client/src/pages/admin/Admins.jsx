import { useMemo, useEffect, useState } from 'react'
import {
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
  MantineReactTable,
  useMantineReactTable,
  MRT_EditActionButtons,
} from 'mantine-react-table'



import { Link, useLoaderData, useParams } from 'react-router-dom'
import { MRT_Localization_AR } from 'mantine-react-table/locales/ar'
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
  Indicator,
  Group,
  Avatar,
  Checkbox,
  Modal,
  NumberInput,
} from '@mantine/core'
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

export default function Admins({ queryClient }) {
  //call CREATE hook
  const { id: collageId } = useParams()
  const { mutateAsync: createAdmin, isLoading: isCreatingAdmin } = useCreateElement(queryClient, [
    'admins',
  ])

  const {
    data: admins = [],
    isError: isLoadingAdminsError,
    isFetching: isFetchingAdmins,
    isLoading: isLoadingAdmins,
  } = useQuery(useGetElements(['admins']))

  // console.log(admins)
  const { mutateAsync: updateAdmin, isLoading: isUpdatingAdmin } = useUpdateElement(queryClient, [
    'admins',
  ])
  const { mutateAsync: deleteAdmin, isLoading: isDeletingAdmin } = useDeleteElement(queryClient, [
    'admins',
  ])

  // const teachersForSelect = getMultiSelectData(teachers)
  const [editingRowData, setEditingRowData] = useState({}) // State for new row data

  const handleCreateAdmin = async ({ values, row, table, exitCreatingMode }) => {
    // console.log(newRowData)
    await createAdmin({ ...newRowData, collage: collageId })
    modals.closeAll()
    table.setCreatingRow(false)
  }

  const [newRowData, setNewrowData] = useState({}) // State for new row data

  //UPDATE action
  const handleSaveAdmin = async ({ values, row, table }) => {
    await updateAdmin({ ...editingRowData, _id: row.id })
    // console.log(values)
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row) => deleteAdmin(row.id)

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
                  <Avatar size={40} src={item.avatar} radius={40} />
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
        enableEditing: false,
      },

      {
        accessorKey: 'phone',
        id: 'phone',
        header: 'رقم الهاتف',
        enableEditing: false,
      },
      {
        accessorKey: 'lastActivity',
        header: 'آخر نشاط',
        accessorFn: (row) =>
          row.lastActivity ? new Date(row?.lastActivity).toLocaleTimeString() : 'unkown',
        enableEditing: false,
      },

      {
        id: 'permissions',
        accessorKey: 'permissions',
        // accessorFn: (row) => row?.admins?.map((sub) => <Badge>{`${sub.name} `}</Badge>) || '',
        Cell: ({ cell }) => {
          if (!cell.getValue() || cell.getValue().length == 0) return ''
          return (
            <Group mt="xs">
              <Checkbox checked={cell.getValue().split('').includes('r')} value="r" label="قراءة" />
              <Checkbox checked={cell.getValue().split('').includes('w')} value="w" label="تعديل" />
              <Checkbox checked={cell.getValue().split('').includes('d')} value="d" label="حذف" />
            </Group>
          )
        },

        // enableEditing: true,
        header: 'الصلاحيات',
        enableEditing: false,
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: admins,
    // enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    enableEditing: true,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    localization: MRT_Localization_AR,
    enableRowActions: true,
    getRowId: (row) => row._id,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },
    mantineToolbarAlertBannerProps: isLoadingAdminsError
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

    onCreatingRowSave: handleCreateAdmin,
    onEditingRowSave: handleSaveAdmin,
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
        <Title order={5}>إنشاء</Title>
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
          label="رقم الهاتف"
          name="phone"
          id="phone"
          placeholder="الرقم"
          onChange={(e) => setNewrowData({ ...newRowData, phone: e.target.value })}
        />
        <Checkbox.Group
          defaultValue={['r']}
          label="حدد صلاحيات المدير:"
          // description="This is anonymous"
          onChange={(e) => setNewrowData({ ...newRowData, permissions: e.join('') })}
          withAsterisk
        >
          <Group mt="xs">
            <Checkbox disabled value="r" label="قراءة" />
            <Checkbox value="w" label="تعديل" />
            <Checkbox value="d" label="حذف" />
          </Group>
        </Checkbox.Group>
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
          id="lastName"
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
        <Checkbox.Group
          defaultValue={row?.original?.permissions?.split('')}
          label="حدد صلاحيات المدير:"
          // description="This is anonymous"
          onChange={(e) => setEditingRowData({ ...editingRowData, permissions: e.join('') })}
          withAsterisk
        >
          <Group mt="xs">
            <Checkbox disabled value="r" label="قراءة" />
            <Checkbox value="w" label="تعديل" />
            <Checkbox value="d" label="حذف" />
          </Group>
        </Checkbox.Group>
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
        // onClick={() => setEditingRowData({ admins: row.getAllCells()[2].getValue() })}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon onClick={() => console.info('Delete')}>{/* <DeleteI /> */}</ActionIcon>
      </Box>
    ),
    state: {
      isLoading: isLoadingAdmins,
      showSkeletons: isLoadingAdmins,
      isSaving: isCreatingAdmin || isUpdatingAdmin || isDeletingAdmin,
      showAlertBanner: isLoadingAdminsError,
      showProgressBars: isFetchingAdmins,
    },
  })

  return <MantineReactTable table={table} />
}

const getMultiSelectData = (admins) =>
  Object.values(admins).map((sub) => ({ value: sub._id, label: sub.name }))

const getSelectedValues = (elements, ids) => {
  const filterdElements = elements.filter((val) => ids.includes(val.value))
  console.log('filterdElements', filterdElements)
  return filterdElements
}
