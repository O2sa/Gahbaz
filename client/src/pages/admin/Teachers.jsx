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
import { IconPlus, IconPencil, IconTrash, IconSchool, IconCopy, IconCheck } from '@tabler/icons-react'
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

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/

const validateName = (val) => {
  if (!val?.trim()) return 'اسم الأستاذ مطلوب'
  if (val.trim().length < 3) return 'يجب أن يتكون الاسم من 3 أحرف على الأقل'
  if (val.trim().length > 70) return 'يجب ألا يتجاوز الاسم 70 حرفاً'
  if (!NAME_REGEX.test(val.trim())) {
    return 'يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية ومسافات فقط بدون أرقام أو رموز'
  }
  return null
}

const TITLE_OPTIONS = [
  { value: 'دكتور', label: 'دكتور' },
  { value: 'أستاذ دكتور', label: 'أستاذ دكتور' },
  { value: 'أستاذ مشارك', label: 'أستاذ مشارك' },
  { value: 'أستاذ مساعد', label: 'أستاذ مساعد' },
  { value: 'محاضر', label: 'محاضر' },
  { value: 'معيد', label: 'معيد' },
  { value: 'أستاذ', label: 'أستاذ' },
]

export default function Teachers() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editTeacher, setEditTeacher] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [createdCredentials, setCreatedCredentials] = useState(null)

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
      title: 'دكتور',
      email: '',
      phone: '',
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
      title: 'دكتور',
      email: '',
      phone: '',
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
          name: `${payload.title ? payload.title + ' ' : ''}${res.data?.name || values.name}`,
          email: res.data?.email || values.email,
          tempPassword: res.tempPassword,
        })
      }
    } catch (err) {
      // Handled in hook notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditTeacher(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      title: row.title || 'دكتور',
      email: row.email || '',
      phone: row.phone || '',
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
      title: 'الأستاذ',
      render: (row) => {
        const teacherName = row.name || row.userName || 'أستاذ'
        return (
          <Group spacing="sm">
            <Avatar color="teal" radius="xl" size="sm">
              {teacherName.charAt(0)}
            </Avatar>
            <div>
              <Group spacing={6}>
                {row.title && (
                  <Badge color="teal" size="xs" variant="filled">
                    {row.title}
                  </Badge>
                )}
                <Text weight={600} size="sm">
                  {teacherName}
                </Text>
              </Group>
              <Text size="xs" color="dimmed">
                {row.email}
              </Text>
            </div>
          </Group>
        )
      },
    },
    {
      key: 'phone',
      title: 'رقم الهاتف',
      align: 'center',
      render: (row) => (
        <Text size="xs" color="dimmed" dir="ltr">
          {row.phone || '—'}
        </Text>
      ),
    },
    {
      key: 'coursesCount',
      title: 'المقررات',
      align: 'center',
      render: (row) => (
        <Badge color="indigo" variant="light" size="sm">
          {row.courses?.length || 0} مقرر
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاريخ الانضمام',
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
        description="إدارة الأساتذة والمحاضرين وتعيين المقررات الدراسية"
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
            <Select
              label="اللقب الأكاديمي"
              data={TITLE_OPTIONS}
              required
              {...addForm.getInputProps('title')}
            />
            <TextInput
              label="الاسم الكامل"
              placeholder="مثال: خالد عبدالرحمن السالم"
              description="يجب أن يتكون من أحرف عربية أو إنجليزية ومسافات فقط"
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
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              {...addForm.getInputProps('phone')}
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
                إضافة الأستاذ
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
            <Select
              label="اللقب الأكاديمي"
              data={TITLE_OPTIONS}
              required
              {...editForm.getInputProps('title')}
            />
            <TextInput
              label="الاسم الكامل"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              required
              disabled
              {...editForm.getInputProps('email')}
            />
            <TextInput
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              {...editForm.getInputProps('phone')}
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

      {/* Generated Credentials Success Modal */}
      <Modal
        opened={Boolean(createdCredentials)}
        onClose={() => setCreatedCredentials(null)}
        title={<Text weight={700} color="teal">تمت إضافة الأستاذ بنجاح</Text>}
      >
        <Stack spacing="md">
          <Text size="sm">
            تم إنشاء حساب عضو هيئة التدريس وتوليد بيانات الدخول المؤقتة التالية:
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
        title="حذف الأستاذ"
        message="هل أنت متأكد من حذف هذا الأستاذ من النظام؟"
        confirmLabel="حذف الأستاذ"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
