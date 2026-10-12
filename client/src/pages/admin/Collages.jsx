import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  Stack,
  Text,
  Badge,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconBuildingSkyscraper } from '@tabler/icons-react'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useColleges,
  useCreateCollege,
  useUpdateCollege,
  useDeleteCollege,
} from '../../hooks/useColleges.js'
import dayjs from 'dayjs'

export default function Collages() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editCollege, setEditCollege] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: collegesRes, isLoading } = useColleges({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateCollege()
  const updateMutation = useUpdateCollege()
  const deleteMutation = useDeleteCollege()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      numberOfSemesters: 8,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الكلية مطلوب' : null),
      numberOfSemesters: (val) => (val < 1 ? 'يجب أن يكون عدد الفصول 1 على الأقل' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      numberOfSemesters: 8,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الكلية مطلوب' : null),
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      await createMutation.mutateAsync(values)
      addForm.reset()
      closeAdd()
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditCollege(row)
    editForm.setValues({
      name: row.name || '',
      numberOfSemesters: row.numberOfSemesters || 8,
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editCollege) return
    try {
      await updateMutation.mutateAsync({
        id: editCollege._id || editCollege.id,
        data: values,
      })
      setEditCollege(null)
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'اسم الكلية',
      render: (row) => (
        <Group spacing="xs">
          <IconBuildingSkyscraper size={18} color="#7c3aed" />
          <Text weight={600} size="sm">
            {row.name}
          </Text>
        </Group>
      ),
    },
    {
      key: 'numberOfSemesters',
      title: 'عدد الفصول',
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {row.numberOfSemesters || 8} فصول
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاريخ الإنشاء',
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed">
          {row.createdAt ? dayjs(row.createdAt).format('YYYY/MM/DD') : '—'}
        </Text>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'left',
      render: (row) => (
        <Group spacing={6} position="left">
          <ActionIcon
            color="brand"
            variant="light"
            size="sm"
            onClick={() => handleEditOpen(row)}
            title="تعديل الكلية"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف الكلية"
          >
            <IconTrash size={15} />
          </ActionIcon>
        </Group>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="الكليات الأكاديمية"
        description="إدارة الكليات والأقسام وتحديد الفصول الدراسية"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الكليات' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            إضافة كلية جديدة
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={collegesRes?.data || []}
        meta={collegesRes?.meta}
        isLoading={isLoading}
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        emptyTitle="لا توجد كليات مسجلة"
        emptyDescription="ابدأ بإضافة كلية جديدة لإدارة التخصصات والمقررات."
      />

      {/* Add College Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>إضافة كلية جديدة</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم الكلية"
              placeholder="مثال: كلية الهندسة وتكنولوجيا المعلومات"
              required
              {...addForm.getInputProps('name')}
            />
            <NumberInput
              label="عدد الفصول الدراسية"
              placeholder="8"
              min={1}
              max={16}
              required
              {...addForm.getInputProps('numberOfSemesters')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={closeAdd}>
                إلغاء
              </Button>
              <Button
                type="submit"
                color="brand"
                loading={createMutation.isPending}
              >
                إضافة
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit College Modal */}
      <Modal
        opened={Boolean(editCollege)}
        onClose={() => setEditCollege(null)}
        title={<Text weight={700}>تعديل الكلية</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم الكلية"
              required
              {...editForm.getInputProps('name')}
            />
            <NumberInput
              label="عدد الفصول الدراسية"
              min={1}
              max={16}
              required
              {...editForm.getInputProps('numberOfSemesters')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditCollege(null)}>
                إلغاء
              </Button>
              <Button
                type="submit"
                color="brand"
                loading={updateMutation.isPending}
              >
                حفظ التعديلات
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        opened={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف الكلية"
        message="هل أنت متأكد من حذف هذه الكلية؟ قد يؤثر ذلك على التخصصات المرتبطة بها."
        confirmLabel="حذف الكلية"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
