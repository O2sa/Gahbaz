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
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from '../../hooks/useStudents.js'
import { useMajors } from '../../hooks/useMajors.js'
import dayjs from 'dayjs'

const NAME_REGEX = /^[\u0600-\u06FFa-zA-Z\s\-]{3,70}$/

const validateName = (val) => {
  if (!val?.trim()) return 'اسم الطالب مطلوب'
  if (val.trim().length < 3) return 'يجب أن يتكون الاسم من 3 أحرف على الأقل'
  if (val.trim().length > 70) return 'يجب ألا يتجاوز الاسم 70 حرفاً'
  if (!NAME_REGEX.test(val.trim())) {
    return 'يجب أن يحتوي الاسم على أحرف عربية أو إنجليزية ومسافات فقط بدون أرقام أو رموز'
  }
  return null
}

export default function Students() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [createdCredentials, setCreatedCredentials] = useState(null)

  // API hooks
  const { data: studentsRes, isLoading } = useStudents({
    page,
    limit,
    search: debouncedSearch,
  })

  const { data: majorsRes } = useMajors({ limit: 100 })
  const majorOptions = (majorsRes?.data || []).map((m) => ({
    value: m._id,
    label: m.name,
  }))

  const createMutation = useCreateStudent()
  const updateMutation = useUpdateStudent()
  const deleteMutation = useDeleteStudent()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      email: '',
      major: '',
      studentId: '',
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
      email: '',
      major: '',
      studentId: '',
      phone: '',
    },
    validate: {
      name: validateName,
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      const payload = { ...values }
      if (!payload.major) delete payload.major
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
    setEditStudent(row)
    editForm.setValues({
      name: row.name || row.userName || '',
      email: row.email || '',
      major: row.major?._id || row.major || '',
      studentId: row.studentId || '',
      phone: row.phone || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editStudent) return
    try {
      const payload = { ...values }
      if (!payload.major) payload.major = null

      await updateMutation.mutateAsync({
        id: editStudent._id || editStudent.id,
        data: payload,
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
      key: 'major',
      title: 'التخصص',
      align: 'center',
      render: (row) => {
        const majorName = row.major?.name || 'غير محدد'
        return (
          <Badge color={row.major ? 'indigo' : 'gray'} variant="light" size="sm">
            {majorName}
          </Badge>
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
              description="يجب أن يتكون من أحرف عربية أو إنجليزية ومسافات فقط"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="البريد الإلكتروني"
              placeholder="ahmed@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <Select
              label="التخصص الأكاديمي"
              placeholder="اختر التخصص (اختياري)"
              data={majorOptions}
              searchable
              clearable
              {...addForm.getInputProps('major')}
            />
            <TextInput
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              {...addForm.getInputProps('phone')}
            />
            <TextInput
              label="الرقم الأكاديمي"
              placeholder="مثال: 20261001"
              {...addForm.getInputProps('studentId')}
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
                تسجيل الطالب
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
              disabled
              {...editForm.getInputProps('email')}
            />
            <Select
              label="التخصص الأكاديمي"
              placeholder="اختر التخصص (اختياري)"
              data={majorOptions}
              searchable
              clearable
              {...editForm.getInputProps('major')}
            />
            <TextInput
              label="رقم الهاتف"
              placeholder="05xxxxxxxx"
              {...editForm.getInputProps('phone')}
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

      {/* Generated Credentials Success Modal */}
      <Modal
        opened={Boolean(createdCredentials)}
        onClose={() => setCreatedCredentials(null)}
        title={<Text weight={700} color="teal">تم تسجيل الطالب بنجاح</Text>}
      >
        <Stack spacing="md">
          <Text size="sm">
            تم إنشاء حساب الطالب وتوليد بيانات الدخول المؤقتة التالية. يرجى تزويد الطالب بها لتسجيل الدخول:
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
        title="حذف الطالب"
        message="هل أنت متأكد من حذف هذا الطالب من النظام؟"
        confirmLabel="حذف الطالب"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
