import React, { useState } from 'react'
import {
  Button,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Stack,
  Text,
  Badge,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconTrash, IconBook } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import {
  DataTable,
  PageHeader,
  ConfirmModal,
} from '../../components/common/index.js'
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../../hooks/useSubjects.js'
import { useColleges } from '../../hooks/useColleges.js'
import dayjs from 'dayjs'

export default function Subjects() {
  const { id: collegeId } = useParams()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 350)

  // Modals state
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [editSubject, setEditSubject] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // API hooks
  const queryParams = {
    page,
    limit,
    search: debouncedSearch,
    ...(collegeId ? { college: collegeId } : {}),
  }
  const { data: subjectsRes, isLoading } = useSubjects(queryParams)
  const { data: collegesRes } = useColleges({ limit: 100 })

  const collegeOptions = (collegesRes?.data || []).map((c) => ({
    value: c._id || c.id,
    label: c.name,
  }))

  const createMutation = useCreateSubject()
  const updateMutation = useUpdateSubject()
  const deleteMutation = useDeleteSubject()

  // Add Form
  const addForm = useForm({
    initialValues: {
      name: '',
      code: '',
      creditHours: 3,
      college: collegeId || '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم المادة مطلوب' : null),
      creditHours: (val) => (val < 1 || val > 10 ? 'عدد الساعات بين 1 و 10' : null),
    },
  })

  // Edit Form
  const editForm = useForm({
    initialValues: {
      name: '',
      code: '',
      creditHours: 3,
      college: '',
    },
    validate: {
      name: (val) => (!val?.trim() ? 'اسم المادة مطلوب' : null),
      creditHours: (val) => (val < 1 || val > 10 ? 'عدد الساعات بين 1 و 10' : null),
    },
  })

  const handleAddSubmit = async (values) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        credits: values.creditHours,
      })
      addForm.reset()
      closeAdd()
    } catch (err) {
      // Handled in notifications
    }
  }

  const handleEditOpen = (row) => {
    setEditSubject(row)
    editForm.setValues({
      name: row.name || '',
      code: row.code || '',
      creditHours: row.creditHours || row.credits || 3,
      college: row.college?._id || row.college || '',
    })
  }

  const handleEditSubmit = async (values) => {
    if (!editSubject) return
    try {
      await updateMutation.mutateAsync({
        id: editSubject._id || editSubject.id,
        data: {
          ...values,
          credits: values.creditHours,
        },
      })
      setEditSubject(null)
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
      title: 'المادة الدراسية',
      render: (row) => (
        <Group spacing="xs">
          <IconBook size={18} color="#7c3aed" />
          <div>
            <Text weight={600} size="sm">
              {row.name}
            </Text>
            {row.code && (
              <Text size="xs" color="dimmed">
                رمز المادة: {row.code}
              </Text>
            )}
          </div>
        </Group>
      ),
    },
    {
      key: 'college',
      title: 'الكلية التابعة',
      align: 'center',
      render: (row) => (
        <Badge color="blue" variant="light" size="sm">
          {row.college?.name || 'عام'}
        </Badge>
      ),
    },
    {
      key: 'creditHours',
      title: 'الساعات المعتمدة',
      align: 'center',
      render: (row) => (
        <Badge color="violet" variant="light" size="sm">
          {row.creditHours || row.credits || 3} ساعات
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
            title="تعديل المادة"
          >
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon
            color="red"
            variant="light"
            size="sm"
            onClick={() => setDeleteId(row._id || row.id)}
            title="حذف المادة"
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
        title="دليل المواد الأكاديمية (Catalog Subjects)"
        description="إدارة المواد الدراسية التأسيسية، الرموز الأكاديمية، والساعات المعتمدة"
        breadcrumbs={[
          { title: 'الرئيسية', href: '/' },
          ...(collegeId ? [{ title: 'الكليات', href: '/collages' }] : []),
          { title: 'دليل المواد الأكاديمية' },
        ]}
        action={
          <Button
            leftIcon={<IconPlus size={16} />}
            color="brand"
            onClick={() => {
              addForm.setFieldValue('college', collegeId || collegeOptions[0]?.value || '')
              openAdd()
            }}
          >
            إضافة مادة جديدة
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={subjectsRes?.data || []}
        meta={subjectsRes?.meta}
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
        emptyTitle="لا توجد مواد مسجلة"
        emptyDescription="ابدأ بإضافة مواد دراسية لتضمينها في الخطط الدراسية وقوالب الفصول."
      />

      {/* Add Subject Modal */}
      <Modal
        opened={addOpened}
        onClose={closeAdd}
        title={<Text weight={700}>إضافة مادة دراسية جديدة</Text>}
      >
        <form onSubmit={addForm.onSubmit(handleAddSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم المادة"
              placeholder="مثال: هندسة البرمجيات المتقدمة"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="رمز المادة (Course Code)"
              placeholder="مثال: CS101"
              {...addForm.getInputProps('code')}
            />
            <Select
              label="الكلية التابعة"
              placeholder="اختر الكلية"
              data={collegeOptions}
              searchable
              {...addForm.getInputProps('college')}
            />
            <NumberInput
              label="الساعات المعتمدة"
              min={1}
              max={10}
              required
              {...addForm.getInputProps('creditHours')}
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

      {/* Edit Subject Modal */}
      <Modal
        opened={Boolean(editSubject)}
        onClose={() => setEditSubject(null)}
        title={<Text weight={700}>تعديل المادة الدراسية</Text>}
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="اسم المادة"
              required
              {...editForm.getInputProps('name')}
            />
            <TextInput
              label="رمز المادة"
              {...editForm.getInputProps('code')}
            />
            <Select
              label="الكلية التابعة"
              placeholder="اختر الكلية"
              data={collegeOptions}
              searchable
              {...editForm.getInputProps('college')}
            />
            <NumberInput
              label="الساعات المعتمدة"
              min={1}
              max={10}
              required
              {...editForm.getInputProps('creditHours')}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={() => setEditSubject(null)}>
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
        title="حذف المادة"
        message="هل أنت متأكد من حذف هذه المادة؟ قد يؤثر ذلك على قوالب الفصول المرتبطة بها."
        confirmLabel="حذف"
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
