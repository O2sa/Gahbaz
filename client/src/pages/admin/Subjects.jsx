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
  Grid,
  Modal,
  Group,
  NumberInput,
} from '@mantine/core'
import {
  IconUserCircle,
  IconSend,
  IconArrowLeftCircle,
  IconArrowBarLeft,
} from '@tabler/icons-react'
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
import { CiEdit } from 'react-icons/ci'
import { useDisclosure } from '@mantine/hooks'

export default function Subjects({ queryClient }) {
  //call CREATE hook
  const { id: collageId } = useParams()
  const { mutateAsync: createSubject, isLoading: isCreatingSubject } = useCreateElement(
    queryClient,
    ['subjects', collageId],
  )

  const {
    data: subjects = [],
    isError: isLoadingSubjectsError,
    isFetching: isFetchingSubjects,
    isLoading: isLoadingSubjects,
  } = useQuery(useGetElements(['subjects', collageId]))
  const {
    data: teachers = [],
    isFetching: isFetchingTeachers,
    isLoading: isLoadingTeachers,
  } = useQuery(useGetElements(['teachers']))

  // console.log(subjects)
  const { mutateAsync: updateSubject, isLoading: isUpdatingSubject } = useUpdateElement(
    queryClient,
    ['subjects', collageId],
  )
  const { mutateAsync: deleteSubject, isLoading: isDeletingSubject } = useDeleteElement(
    queryClient,
    ['subjects', collageId],
  )

  const teachersForSelect = getMultiSelectData(teachers)
  const [editingRowData, setEditingRowData] = useState({}) // State for new row data
  const [gradeSchema, setGradeSchema] = useState({}) // State for new row data

  const handleCreateSubject = async ({ values, row, table, exitCreatingMode }) => {
    // console.log(newRowData)
    await createSubject({ ...newRowData, collage: collageId })
    modals.closeAll()
    table.setCreatingRow(false)
  }

  const [newRowData, setNewrowData] = useState({}) // State for new row data

  //UPDATE action
  const handleSaveSubject = async ({ values, row, table }) => {
    await updateSubject({ ...values, ...editingRowData, _id: row.id })
    table.setEditingRow(null) //exit editing mode
  }

  //DELETE action
  const openDeleteConfirmModal = (row) => deleteSubject(row.id)

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
        header: 'الأسم',
        enableEditing: false,
      },
      {
        accessorKey: 'subtitle',
        header: 'العنوان الفرعي',
        enableEditing: false,
      },
      {
        accessorKey: 'category',
        header: 'التصنيف',
        enableEditing: false,
      },
      {
        accessorKey: 'teachers',
        enableEditing: false,

        Cell: ({ cell, row }) => {
          if (!cell.getValue()) return ''

          return row.original.teachers?.map((val) => (
            <Badge>{`${val.firstName} ${val.lastName}`}</Badge>
          ))
        },
        header: 'المعلمون',
      },
      {
        accessorKey: 'gradeSchema',
        Cell: ({ cell, row }) => {
          if (!cell.getValue()) return ''
          const elements = cell.getValue().grade
          const keys = Object.keys(cell.getValue().grade)
          const grades = keys?.map((ele) => (
            <Badge>{`${elements[ele]?.name ?? ''}: ${elements[ele]?.value ?? ''} `}</Badge>
          ))
          return (
            <>
              {grades}
              <Badge m={'sm'} color="green">{`المجموع: ${cell.getValue()?.total ?? ''} `}</Badge>
              <EditSchema
                queryClient={queryClient}
                gradeSchema={cell.getValue()}
                subjectId={row.original._id}
              >
                <Button
                  m={'md'}
                  variant="subtle"
                  leftIcon={<CiEdit size={14} />}
                  rightIcon={<IconArrowBarLeft size={14} />}
                >
                  تعديل
                </Button>
              </EditSchema>
            </>
          )
        },
        header: 'هيكلية الدرجات',
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns: columns,
    data: subjects,
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
    mantineToolbarAlertBannerProps: isLoadingSubjectsError
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

    onCreatingRowSave: handleCreateSubject,
    onEditingRowSave: handleSaveSubject,
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
          label="الأسم"
          name="name"
          id="name"
          // placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...newRowData, name: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="العنوان الفرعي"
          name="subtitle"
          id="subtitle"
          // placeholder=" subtitle"
          onChange={(e) => setNewrowData({ ...newRowData, subtitle: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="التصنيف"
          name="category"
          id="category"
          // placeholder="اسم الكلية"
          onChange={(e) => setNewrowData({ ...newRowData, category: e.target.value })}
        />
        <MultiSelect
          data={teachersForSelect}
          label="المعلمون"
          // placeholder="Pick all that you like"
          name="teachers"
          id="teachers"
          onChange={(selectedValue) => setNewrowData({ ...newRowData, teachers: selectedValue })}
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
          label="الأسم"
          name="name"
          defaultValue={row?.original.name}
          id="name"
          // placeholder="اسم الكلية"
          onChange={(e) => setEditingRowData({ ...editingRowData, name: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="العنوان الفرعي"
          name="subtitle"
          defaultValue={row?.original.subtitle}
          id="subtitle"
          // placeholder=" subtitle"
          onChange={(e) => setEditingRowData({ ...editingRowData, subtitle: e.target.value })}
        />{' '}
        <TextInput
          withAsterisk
          label="التصنيف"
          name="category"
          defaultValue={row?.original.category}
          id="category"
          // placeholder="اسم الكلية"
          onChange={(e) => setEditingRowData({ ...editingRowData, category: e.target.value })}
        />
        <MultiSelect
          data={teachersForSelect}
          label="المعلمون"
          // placeholder="Pick all that you like"
          // defaultValue={row?.getAllCells()[5]?.getValue()}
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
        إنشاء{' '}
      </Button>
    ),

    renderRowActionMenuItems: ({ row }) => (
      <Box>
        <ActionIcon
        // onClick={() => setEditingRowData({ subjects: row.getAllCells()[2].getValue() })}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon onClick={() => console.info('Delete')}>{/* <DeleteI /> */}</ActionIcon>
      </Box>
    ),
    state: {
      isLoading: isLoadingSubjects,
      isSaving: isCreatingSubject || isUpdatingSubject,
      showAlertBanner: isLoadingSubjectsError,
      showProgressBars: isFetchingSubjects,
    },
  })

  return <MantineReactTable table={table} />
}

const getMultiSelectData = (subjects) =>
  Object.values(subjects).map((sub) => ({
    value: sub._id,
    label: `${sub.firstName} ${sub.lastName}`,
  }))

const getTheTotal = (elements) => {
  let total = 0
  for (const ele in elements) total += elements[ele].value
  return total
}

function EditSchema({ children, queryClient, gradeSchema, subjectId }) {
  const { id: collageId } = useParams()

  const { mutateAsync: updateSubject, isLoading: isUpdatingSubject } = useUpdateElement(
    queryClient,
    ['subjects', collageId],
  )
  // const te = useCreateElement(queryClient)
  const [fields, setFields] = useState(gradeSchema)
  console.log('fields', fields)
  // console.log('fields', gradeSchema)

  const [opened, { open, close }] = useDisclosure(false)
  // console.log(isCreatingCollage)
  // console.log('isCreatingCollage')
  const addField = () => {
    const key = Object.keys(fields.grade).length
    setFields({
      ...fields,
      total: Object.keys(fields.grade)?.reduce((ac, val) => fields.grade[val].value + ac, 0) + 10,

      grade: { ...fields.grade, [key]: { name: '', value: 10 } },
    })
  }
  const handleCloseModal = () => {
    close()
  }

  const handleSubmit = async (values) => {
    console.log('values')
    console.log(values)
    try {
      const res = await updateSubject({ gradeSchema: fields, _id: subjectId })
      close()
    } catch (error) {}
  }

  return (
    <Group position="center">
      <Modal centered={true} title="إنشاء كلية" opened={opened} onClose={close}>
        <>
          {/* <form onSubmit={form.onSubmit(handleSubmit)}> */}
          <Group>
            {Object.keys(fields.grade)?.map((val, idx) => (
              <Group noWrap>
                <TextInput
                  onChange={(e) =>
                    setFields({
                      ...fields,
                      grade: {
                        ...fields.grade,
                        [val]: { ...fields.grade[val], name: e.target.value },
                      },
                    })
                  }
                  placeholder="اسم الحقل"
                  defaultValue={fields.grade[val].name}
                  withAsterisk
                />{' '}
                <NumberInput
                  placeholder="قيمة الحقل"
                  onChange={(e) => {
                    console.log(e)
                    setFields({
                      ...fields,
                      grade: {
                        ...fields.grade,
                        [val]: { ...fields.grade[val], value: e },
                      },
                      total: Object.keys(fields.grade)?.reduce(
                        (ac, val) => fields.grade[val].value + ac,
                        0,
                      ),
                    })
                  }}
                  defaultValue={fields.grade[val].value}
                  withAsterisk
                />
              </Group>
            ))}
            <Badge radius={'xl'} fullWidth color="green" h={32}>
              {':المجموع' + fields.total}
            </Badge>
            <Button variant="light" onClick={addField} fullWidth>
              إضافة حقل
            </Button>
          </Group>

          <Group position="right" mt="md">
            <Button onClick={handleSubmit} loading={isUpdatingSubject} type="submit">
              حفط
            </Button>
          </Group>
          {/* </form> */}
        </>
      </Modal>
      <Group onClick={open}>{children}</Group>
    </Group>
  )
}
