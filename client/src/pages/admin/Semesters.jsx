import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  Stack,
  Text,
  Badge,
  Switch,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconCalendarEvent } from '@tabler/icons-react'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useSemesters,
  useCreateSemester,
  useUpdateSemester,
  useDeleteSemester,
} from '../../hooks/useSemesters.js'
import dayjs from 'dayjs'

export default function Semesters() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editSemester, setEditSemester] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: semestersRes, isLoading } = useSemesters({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateSemester()
  const updateMutation = useUpdateSemester()
  const deleteMutation = useDeleteSemester()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      isActive: true,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الفصل مطلوب' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      academicYear: '',
      isActive: false,
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الفصل مطلوب' : null),
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      await createMutation.mutateAsync(values)
      addForm.reset()
      closeAdd()
    } catch (err) {
      // Handled in notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditSemester(row)
    editForm.setValues({
      name: row.name || '',
      academicYear: row.academicYear || '',
      isActive: Boolean(row.isActive),
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editSemester) return
    try {
      await updateMutation.mutateAsync({
        id: editSemester._id || editSemester.id,
        data: values,
      })
      setEditSemester(null)
    } catch (err) {
      // Handled in notifications
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      setDeleteId(null)
    } catch (err) {
      // Handled in notifications
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'الفصل الدراسي',
      render: (row) => (
        <Group spacing="xs">
          <IconCalendarEvent size={18} color="#7c3aed" />
          <Text weight={600} size="sm">
            {row.name}
          </Text>
        </Group>
      ),
    },
    {
      key: 'academicYear',
      title: 'العام الأكاديمي',
      align: 'center',
      render: (row) => (
        <Badge color="gray" variant="outline" size="sm">
          {row.academicYear || '—'}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      title: 'الحالة',
      align: 'center',
      render: (row) => (
        <Badge
          color={row.isActive ? 'teal' : 'gray'}
          variant={row.isActive ? 'filled' : 'light'}
          size="sm"
        >
          {row.isActive ? 'نشط حالياً' : 'مكتمل / غير نشط'}
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
            title="تعديل الفصل"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف الفصل"
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
        title="الفصول الدراسية"
        description="إدارة وتتبع الفصول والسنوات الدراسية ومتابعة الفصول النشطة"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الفصول الدراسية' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            بدء فصل دراسي جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={semestersRes?.data || []}
        meta={semestersRes?.meta}
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
        emptyTitle="لا توجد فصول دراسية"
        emptyDescription="ابدأ بإنشاء فصل دراسي جديد لتفعيل المواد والجداول."
      />

      {/* Add Semester Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>إنشاء فصل دراسي جديد</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم الفصل الدراسي"
              placeholder="مثال: الفصل الدراسي الأول"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="العام الأكاديمي"
              placeholder="2026-2027"
              required
              {...addForm.getInputProps('academicYear')}
            />
            <Switch
              label="تعيين كفصل دراسي نشط حالياً"
              {...addForm.getInputProps('isActive', { type: 'checkbox' })}
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
                إنشاء
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Semester Modal */}
      <Modal
        opened={Boolean(editSemester)}
        onClose={() => setEditSemester(null)}
        title={<Text weight={700}>تعديل الفصل الدراسي</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم الفصل الدراسي"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="العام الأكاديمي"
              required
              {...editForm.getInputProps('academicYear')}
            />
            <Switch
              label="الفصل نشط حالياً"
              {...editForm.getInputProps('isActive', { type: 'checkbox' })}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditSemester(null)}>
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
        title="حذف الفصل الدراسي"
        message="هل أنت متأكد من حذف هذا الفصل الدراسي؟"
        confirmLabel="حذف الفصل"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
