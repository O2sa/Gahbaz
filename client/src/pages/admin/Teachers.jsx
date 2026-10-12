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
  Avatar,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconUserCheck } from '@tabler/icons-react'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from '../../hooks/useTeachers.js'
import dayjs from 'dayjs'

export default function Teachers() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editTeacher, setEditTeacher] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: teachersRes, isLoading } = useTeachers({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateTeacher()
  const updateMutation = useUpdateTeacher()
  const deleteMutation = useDeleteTeacher()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      email: '',
      department: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الأستاذ مطلوب' : null),
      email: (val) => (!val?.includes('@') ? 'البريد الإلكتروني غير صالح' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      email: '',
      department: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الأستاذ مطلوب' : null),
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
    setEditTeacher(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      email: row.email || '',
      department: row.department || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editTeacher) return
    try {
      await updateMutation.mutateAsync({
        id: editTeacher._id || editTeacher.id,
        data: values,
      })
      setEditTeacher(null)
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
      title: 'عضو هيئة التدريس',
      render: (row) => {
        const teacherName = row.name || row.userName || 'أستاذ'
        return (
          <Group spacing="sm">
            <Avatar color="blue" radius="xl" size="sm">
              {teacherName.charAt(0)}
            </Avatar>
            <div>
              <Text weight={600} size="sm">
                {teacherName}
              </Text>
              <Text size="xs" color="dimmed">
                {row.email}
              </Text>
            </div>
          </Group>
        )
      },
    },
    {
      key: 'department',
      title: 'القسم الأكاديمي',
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {row.department || 'عام'}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'الحالة',
      align: 'center',
      render: () => (
        <Badge color="teal" variant="light" size="sm">
          نشط
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاريخ الإضافة',
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
            title="تعديل بيانات الأستاذ"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف الأستاذ"
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
        title="هيئة التدريس"
        description="إدارة الأساتذة والمحاضرين وتوزيع المقررات والأقسام الأكاديمية"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الأساتذة' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            إضافة أستاذ جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={teachersRes?.data || []}
        meta={teachersRes?.meta}
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
        emptyTitle="لا يوجد أساتذة مسجلين"
        emptyDescription="ابدأ بإضافة أعضاء هيئة التدريس لتعيين المقررات لهم."
      />

      {/* Add Teacher Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>إضافة أستاذ جديد</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="الاسم الكامل"
              placeholder="مثال: د. خالد عبدالرحمن"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              placeholder="khaled@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <TextInput
              label="القسم / التخصص"
              placeholder="علوم الحاسوب"
              {...addForm.getInputProps('department')}
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

      {/* Edit Teacher Modal */}
      <Modal
        opened={Boolean(editTeacher)}
        onClose={() => setEditTeacher(null)}
        title={<Text weight={700}>تعديل بيانات الأستاذ</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="الاسم الكامل"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              required
              {...editForm.getInputProps('email')}
            />
            <TextInput
              label="القسم / التخصص"
              {...editForm.getInputProps('department')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditTeacher(null)}>
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
        title="حذف الأستاذ"
        message="هل أنت متأكد من حذف هذا الأستاذ من النظام؟"
        confirmLabel="حذف"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
