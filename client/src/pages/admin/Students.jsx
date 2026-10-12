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
import { IconPlus, IconPencil, IconTrash, IconSchool } from '@tabler/icons-react'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '../../hooks/useStudents.js'
import dayjs from 'dayjs'

export default function Students() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: studentsRes, isLoading } = useStudents({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateStudent()
  const updateMutation = useUpdateStudent()
  const deleteMutation = useDeleteStudent()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      email: '',
      studentId: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الطالب مطلوب' : null),
      email: (val) => (!val?.includes('@') ? 'البريد الإلكتروني غير صالح' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      email: '',
      studentId: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم الطالب مطلوب' : null),
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
    setEditStudent(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      email: row.email || '',
      studentId: row.studentId || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editStudent) return
    try {
      await updateMutation.mutateAsync({
        id: editStudent._id || editStudent.id,
        data: values,
      })
      setEditStudent(null)
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
      title: 'الطالب',
      render: (row) => {
        const studentName = row.name || row.userName || 'طالب'
        return (
          <Group spacing="sm">
            <Avatar color="brand" radius="xl" size="sm">
              {studentName.charAt(0)}
            </Avatar>
            <div>
              <Text weight={600} size="sm">
                {studentName}
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
      key: 'studentId',
      title: 'الرقم الأكاديمي',
      align: 'center',
      render: (row) => (
        <Badge color="gray" variant="outline" size="sm">
          {row.studentId || row._id?.slice(-6) || '—'}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'الحالة',
      align: 'center',
      render: (row) => (
        <Badge color="teal" variant="light" size="sm">
          منتظم
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاريخ التسجيل',
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
            title="تعديل بيانات الطالب"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف الطالب"
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
        title="دليل الطلاب"
        description="إدارة الطلاب المسجلين والبيانات الأكاديمية والنتائج"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الطلاب' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            تسجيل طالب جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={studentsRes?.data || []}
        meta={studentsRes?.meta}
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
        emptyTitle="لا يوجد طلاب مسجلين"
        emptyDescription="ابدأ بتسجيل طلاب جدد في النظام لإدراجهم في المقررات."
      />

      {/* Add Student Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>تسجيل طالب جديد</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم الطالب الكامل"
              placeholder="مثال: أحمد محمد علي"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              placeholder="ahmed@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <TextInput
              label="الرقم الأكاديمي"
              placeholder="20261001"
              {...addForm.getInputProps('studentId')}
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
                تسجيل
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        opened={Boolean(editStudent)}
        onClose={() => setEditStudent(null)}
        title={<Text weight={700}>تعديل بيانات الطالب</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم الطالب"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              required
              {...editForm.getInputProps('email')}
            />
            <TextInput
              label="الرقم الأكاديمي"
              {...editForm.getInputProps('studentId')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditStudent(null)}>
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
        title="حذف الطالب"
        message="هل أنت متأكد من حذف هذا الطالب من النظام؟"
        confirmLabel="حذف الطالب"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
