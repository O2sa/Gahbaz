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

export default function SemestersTemplate({ queryClient }) {
  //call CREATE hook
  const { id: majorId } = useParams()
  const { mutateAsync: createTemplate, isLoading: isCreatingTemplate } = useCreateElement(
    queryClient,
    ['semester-templates', majorId],
  )

  const {
    data: templates = [],
    isError: isLoadingTemplatesError,
    isFetching: isFetchingTemplates,
    isLoading: isLoadingTemplates,
  } = useQuery(useGetElements(['semester-templates', majorId]))
  const {
    data: subjects = [],
    isFetching: isFetchingSubjects,
    isLoading: isLoadingSubjects,
  } = useQuery(useGetElements(['subjects', 'collage-subjects', majorId]))

  // console.log(subjects)
  const { mutateAsync: updateTemplate, isLoading: isUpdatingTemplate } = useUpdateElement(
    queryClient,
    ['semester-templates', majorId],
  )
  const { mutateAsync: deleteTemplate, isLoading: isDeletingTemplate } = useDeleteElement(
    queryClient,
    ['semester-templates', majorId],
  )

  const subjectsForSelect = getMultiSelectData(subjects)
  const [editingRowData, setEditingRowData] = useState({}) // State for new row data

  const handleCreateTemplate = async ({ values, row, table, exitCreatingMode }) => {
    // console.log(newRowData)
    await createTemplate({ ...newRowData, index: templates.length + 1 })
    modals.closeAll()
    table.setCreatingRow(false)
  }

  const [newRowData, setNewrowData] = useState({ major: majorId }) // State for new row data

  //UPDATE action
  const handleSaveTemplate = async ({ values, row, table }) => {
    console.log('editingRowData', editingRowData)
    console.log('values', values)
    await updateTemplate({ ...values, ...editingRowData, _id: row.id })
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row) => deleteTemplate(row.id)

  const columns = useMemo(
    () => [
      {
        id: 'index', // Use "index" as the accessor key
        enableEditing: false,
        accessorKey: 'index',
        header: 'الفصل', // Header label for the index column
      },
      {
        id: 'subjects',
        accessorKey: 'subjects',
        // accessorFn: (row) => row?.subjects?.map((sub) => <Badge>{`${sub.name} `}</Badge>) || '',
        Cell: ({ cell }) => {
          // console.log("cell", cell);
          // console.log("value", cell.value);
          // console.log("teacher", cell.getValue());
          if (!cell.getValue() || cell.getValue().length == 0) return ''
          return cell.getValue()?.map((sub) =>  <Badge>{`${sub?.name } `}</Badge>)
        },
        enableEditing: true,
        header: 'المواد',
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: templates,
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
    mantineToolbarAlertBannerProps: isLoadingTemplatesError
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

    onCreatingRowSave: handleCreateTemplate,
    onEditingRowSave: handleSaveTemplate,
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

        {/* <TextInput
          withAsterisk
          label="الأسم"
          name="name"
          id="name"
          placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...newRowData, name: e.target.value })}
        /> */}

        <MultiSelect
          data={subjectsForSelect}
          label="المواد"
          placeholder="اختر المواد "
          name="subjects"
          id="subjects"
          clearButtonProps={{ 'aria-label': 'Clear selection' }}
          onChange={(selectedValue) => setNewrowData({ ...newRowData, subjects: selectedValue })}
        />

        <Flex justify="flex-end">
          <MRT_EditActionButtons row={row} table={table} variant="text" />{' '}
          {/* <Button onClick={handleCreateTemplate}>create</Button>{' '} */}
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ internalEditComponents, row, table }) => (
      <Stack>
        <Title order={5}>My Custom Edit Modal</Title>

        {/* <TextInput
          withAsterisk
          label="الأسم"
          name="name"
          id="name"
          placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...editingRowData, name: e.target.value })}
        /> */}
        {console.log(editingRowData.subjects)}
        <MultiSelect
          data={subjectsForSelect}
          label="المواد"
          placeholder="اختر المواد "
          defaultValue={row?.getAllCells()[2]?.getValue()}
          // defaultValue={getSelectedValues(subjectsForSelect, row?.getAllCells()[2]?.getValue())}
          name="subjects"
          id="subjects"
          // clearButtonProps={{ 'aria-label': 'Clear selection' }}
          onChange={(selectedValue) =>
            setEditingRowData({ ...editingRowData, subjects: selectedValue })
          }
        />
        {/* {row.getAllCells().map((cell, index) => {
          {
            console.log('row vale', row.getAllCells()[index].getValue())
          }
          {
            console.log('row id', row.getAllCells()[index].id)
          }
        })} */}
        <Flex justify="flex-end">
          <MRT_EditActionButtons row={row} table={table} variant="text" />{' '}
          {/* <Button onClick={handleCreateTemplate}>create</Button>{' '} */}
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



    state: {
      isLoading: isLoadingTemplates,
      isSaving: isCreatingTemplate || isUpdatingTemplate,
      showAlertBanner: isLoadingTemplatesError,
      showProgressBars: isFetchingTemplates,
    },
  })

  return <MantineReactTable table={table} />
}

const getMultiSelectData = (subjects) =>
  Object.values(subjects).map((sub) => ({ value: sub._id, label: sub.name }))

const getSelectedValues = (elements, ids) => {
  const filterdElements = elements.filter((val) => ids.includes(val.value))
  console.log('filterdElements', filterdElements)
  return filterdElements
}
