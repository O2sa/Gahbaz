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
import { IconPlus, IconPencil, IconTrash, IconShieldCheck } from '@tabler/icons-react'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
} from '../../hooks/useAdmins.js'
import dayjs from 'dayjs'

export default function Admins() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editAdmin, setEditAdmin] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const { data: adminsRes, isLoading } = useAdmins({
    page,
    limit,
    search: debouncedSearch,
  })

  const createMutation = useCreateAdmin()
  const updateMutation = useUpdateAdmin()
  const deleteMutation = useDeleteAdmin()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم المدير مطلوب' : null),
      email: (val) => (!val?.includes('@') ? 'البريد الإلكتروني غير صالح' : null),
      password: (val) => (!val || val.length < 6 ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      email: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم المدير مطلوب' : null),
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
    setEditAdmin(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      email: row.email || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editAdmin) return
    try {
      await updateMutation.mutateAsync({
        id: editAdmin._id || editAdmin.id,
        data: values,
      })
      setEditAdmin(null)
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
      title: 'المدير',
      render: (row) => {
        const adminName = row.name || row.userName || 'مدير'
        return (
          <Group spacing="sm">
            <Avatar color="violet" radius="xl" size="sm">
              {adminName.charAt(0)}
            </Avatar>
            <div>
              <Text weight={600} size="sm">
                {adminName}
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
      key: 'role',
      title: 'الدور والمسؤوليات',
      align: 'center',
      render: () => (
        <Badge color="violet" variant="light" size="sm">
          مدير نظام
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
            title="تعديل بيانات المدير"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف المدير"
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
        title="إدارة مسؤولي النظام"
        description="إدارة الحسابات الإدارية وتعيين صلاحيات لوحة التحكم"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'الإداريون' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={openAdd}
          >
            إضافة مدير جديد
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={adminsRes?.data || []}
        meta={adminsRes?.meta}
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
        emptyTitle="لا يوجد إداريون مسجلون"
        emptyDescription="ابدأ بإضافة مديرين لمنحهم صلاحيات إدارة النظام."
      />

      {/* Add Admin Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>إضافة مدير جديد</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم المدير"
              placeholder="مثال: م. أحمد عبدالكريم"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              placeholder="admin@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <TextInput
              label="كلمة المرور المؤقتة"
              type="password"
              placeholder="••••••••"
              required
              {...addForm.getInputProps('password')}
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

      {/* Edit Admin Modal */}
      <Modal
        opened={Boolean(editAdmin)}
        onClose={() => setEditAdmin(null)}
        title={<Text weight={700}>تعديل بيانات المدير</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم المدير"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              required
              {...editForm.getInputProps('email')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditAdmin(null)}>
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
        title="حذف المدير"
        message="هل أنت متأكد من حذف هذا الحساب الإداري؟"
        confirmLabel="حذف"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
