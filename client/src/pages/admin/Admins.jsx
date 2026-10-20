import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  Badge,
  Avatar,
  Paper,
  CopyButton,
  Code,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconShieldCheck, IconCopy, IconCheck } from '@tabler/icons-react'
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

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/

const validateName = (val) => {
  if (!val?.trim()) return 'اسم المدير مطلوب'
  if (val.trim().length < 3) return 'يجب أن يتكون الاسم من 3 أحرف على الأقل'
  if (val.trim().length > 70) return 'يجب ألا يتجاوز الاسم 70 حرفاً'
  if (!NAME_REGEX.test(val.trim())) {
    return 'يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية ومسافات فقط بدون أرقام أو رموز'
  }
  return null
}

const PERMISSION_OPTIONS = [
  { value: 'rw', label: 'قراءة وتعديل (افتراضي)' },
  { value: 'r', label: 'قراءة فقط' },
  { value: 'rwd', label: 'تحكم كامل (قراءة، تعديل، حذف)' },
  { value: 'rd', label: 'قراءة وحذف' },
]

export default function Admins() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editAdmin, setEditAdmin] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [createdCredentials, setCreatedCredentials] = useState(null)

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
      permissions: 'rw',
      password: '',
    },
    validate: {
      name: validateName,
      email: (val) => (!val?.includes('@') ? 'البريد الإلكتروني غير صالح' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      email: '',
      permissions: 'rw',
    },
    validate: {
      name: validateName,
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      const payload = { ...values }
      if (!payload.password) delete payload.password

      const res = await createMutation.mutateAsync(payload)
      addForm.reset()
      closeAdd()

      if (res?.tempPassword) {
        setCreatedCredentials({
          name: res.data?.name || values.name,
          email: res.data?.email || values.email,
          tempPassword: res.tempPassword,
        })
      }
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditAdmin(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      email: row.email || '',
      permissions: row.permissions || 'rw',
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
      title: 'الدور',
      align: 'center',
      render: (row) => (
        <Badge
          color={row.role === 'super-admin' ? 'red' : 'violet'}
          variant="filled"
          size="sm"
        >
          {row.role === 'super-admin' ? 'مدير عام' : 'مدير نظام'}
        </Badge>
      ),
    },
    {
      key: 'permissions',
      title: 'مستوى الصلاحيات',
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.permissions === 'rwd'
            ? 'تحكم كامل'
            : row.permissions === 'rw'
            ? 'قراءة وتعديل'
            : row.permissions === 'r'
            ? 'قراءة فقط'
            : row.permissions || 'rw'}
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
        title="إدارة المسؤولين"
        description="إدارة الحسابات الإدارية والصلاحيات والوصول للنظام"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          { title: 'المسؤولون' },
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
              label="اسم المدير الكامل"
              placeholder="مثال: أحمد عبدالكريم السالم"
              description="يجب أن يتكون من أحرف عربية أو إنجليزية ومسافات فقط"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              placeholder="admin@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <Select
              label="مستوى الصلاحيات"
              data={PERMISSION_OPTIONS}
              required
              {...addForm.getInputProps('permissions')}
            />
            <PasswordInput
              label="كلمة المرور"
              placeholder="اتركه فارغاً للتوليد التلقائي"
              description="إذا تركته فارغاً، سيتم توليد كلمة مرور عشوائية وتزويدك بها"
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
                إضافة المدير
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
              disabled
              {...editForm.getInputProps('email')}
            />
            <Select
              label="مستوى الصلاحيات"
              data={PERMISSION_OPTIONS}
              required
              {...editForm.getInputProps('permissions')}
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

      {/* Generated Credentials Success Modal */}
      <Modal
        opened={Boolean(createdCredentials)}
        onClose={() => setCreatedCredentials(null)}
        title={<Text weight={700} color="teal">تمت إضافة المدير بنجاح</Text>}
      >
        <Stack spacing="md">
          <Text size="sm">
            تم إنشاء الحساب الإداري وتوليد بيانات الدخول المؤقتة التالية:
          </Text>
          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Stack spacing="xs">
              <Text size="sm">
                <strong>الاسم:</strong> {createdCredentials?.name}
              </Text>
              <Text size="sm">
                <strong>البريد الإلكتروني:</strong> {createdCredentials?.email}
              </Text>
              <Group position="apart" align="center">
                <Text size="sm">
                  <strong>كلمة المرور المؤقتة:</strong>{' '}
                  <Code color="teal">{createdCredentials?.tempPassword}</Code>
                </Text>
                <CopyButton
                  value={`البريد الإلكتروني: ${createdCredentials?.email}\nكلمة المرور: ${createdCredentials?.tempPassword}`}
                >
                  {({ copied, copy }) => (
                    <Button
                      color={copied ? 'teal' : 'brand'}
                      size="xs"
                      leftIcon={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      onClick={copy}
                    >
                      {copied ? 'تم النسخ!' : 'نسخ بيانات الدخول'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Stack>
          </Paper>
          <Button fullWidth onClick={() => setCreatedCredentials(null)}>
            تم
          </Button>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        opened={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف المدير"
        message="هل أنت متأكد من حذف هذا الحساب الإداري؟"
        confirmLabel="حذف المدير"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
